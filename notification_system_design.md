# 📐 Notification System Design

**Author:** Mohammad Hamza Khan  
**Registration:** RA2311003010914  
**College:** SRM Institute of Science and Technology  

---

## 1. Overview

The Campus Notification System fetches notifications from a protected external REST API and exposes processed, sorted, and filtered data through a set of internal API endpoints. This document explains the key design decisions, algorithms, and scalability considerations.

---

## 2. Priority Logic

Notifications are ranked using a **numeric priority map**:

| Type      | Priority Rank | Label   |
|-----------|:-------------:|---------|
| Placement | 1             | High    |
| Event     | 2             | Medium  |
| Others    | 3             | Low     |

**Implementation** (`notificationService.js`):

```js
const PRIORITY_MAP = {
  placement: 1,
  event: 2,
};

function getPriority(type = "") {
  return PRIORITY_MAP[type.toLowerCase()] ?? 3;
}
```

The lookup uses a hash map (O(1) per notification). Any type not in the map automatically falls to priority rank 3 (lowest), making the system **open-closed** — new types can be added to the map without changing the sort logic.

---

## 3. Sorting Approach

### Priority Endpoint (`GET /notifications/priority`)

Notifications are sorted using a **compound comparator**:

1. **Primary key:** Priority rank (ascending → rank 1 appears first)
2. **Secondary key:** Timestamp (descending → latest appears first within the same rank)

```js
notifications.sort((a, b) => {
  const rankDiff = getPriority(a.Type) - getPriority(b.Type);
  if (rankDiff !== 0) return rankDiff;                      // Sort by priority
  return parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp); // Then by time
});
```

After sorting, only the **top 10** results are returned (`slice(0, 10)`).

**Time Complexity:** O(n log n) where n = total notifications from the external API.

### Type Filter Endpoint (`GET /notifications/type/:type`)

Simple linear filter followed by a timestamp sort:

```js
notifications
  .filter(n => n.Type?.toLowerCase() === type.toLowerCase())
  .sort((a, b) => parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp));
```

### Latest Endpoint (`GET /notifications/latest`)

Single sort by timestamp descending, then slice to 5:

```js
notifications
  .sort((a, b) => parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp))
  .slice(0, 5);
```

---

## 4. Timestamp Parsing

The external API returns timestamps in the format `YYYY-MM-DD HH:mm:ss` (space-separated). JavaScript's `Date` constructor requires ISO 8601 format (`T` separator), so we normalize:

```js
function parseTimestamp(ts) {
  return new Date(ts.replace(" ", "T"));
}
```

This avoids any timezone ambiguity issues with browser `Date` parsing.

---

## 5. Handling Continuous / High-Volume Notifications

The current implementation is **stateless** — each API call fetches fresh data from the external source. This is ideal for a campus-scale system where data volume is moderate. For higher-throughput scenarios:

### Short-Term: In-Memory Caching

Add a simple TTL (time-to-live) cache in the service layer:

```js
let cache = { data: null, expiresAt: 0 };
const TTL_MS = 30_000; // 30 seconds

async function fetchAllNotifications() {
  if (Date.now() < cache.expiresAt) return cache.data;
  const data = await axiosFetch();
  cache = { data, expiresAt: Date.now() + TTL_MS };
  return data;
}
```

**Trade-off:** Fresh data every 30 seconds vs. every request. Reduces external API load by ~60× at typical campus usage rates.

### Medium-Term: Redis Cache

Replace in-memory cache with **Redis** for distributed deployments:

```
External API → Backend Server A ─┐
                                  ├─→ Redis Cache (TTL: 30s) → Client
External API → Backend Server B ─┘
```

- All backend instances share a single source of truth
- Horizontal scaling becomes trivial
- Cache invalidation via `EXPIRE` keys

### Long-Term: Event-Driven Architecture

For real-time delivery:

```
External API (polling) → Message Queue (RabbitMQ / Kafka)
                              │
                      ┌───────┴────────┐
                 Priority Worker   Filter Worker
                      │                │
                   Sorted DB       Indexed DB
                      │
                 WebSocket Server → React Frontend (live push)
```

Key components:
1. **Poller Service** — polls external API at configurable intervals (e.g., every 10s)
2. **Message Queue** — decouples ingestion from processing
3. **Worker Services** — consume queue, apply priority/filter logic, write to DB
4. **WebSocket Layer** — pushes updates to connected clients without polling

---

## 6. Scalability Considerations

| Concern              | Current Solution              | Scalable Solution              |
|----------------------|-------------------------------|--------------------------------|
| Data Freshness       | Fetch-on-request (stateless)  | Cache (Redis, TTL)             |
| High Read Traffic    | Single Express instance        | Load Balancer + Horizontal Scale |
| Real-Time Updates    | Client polls on refresh       | WebSocket / SSE push           |
| Persistent Storage   | None (no DB per spec)         | PostgreSQL / MongoDB           |
| Auth Token Security  | .env variable                 | Secrets Manager (AWS/Vault)    |
| Observability        | Console logs                  | Structured logs (Winston) + APM |
| Rate Limiting        | Not implemented               | express-rate-limit middleware  |

---

## 7. Error Handling Strategy

The backend uses a **centralized error handler** middleware:

- `axios` errors (network/4xx/5xx from external API) → returned as `502 Bad Gateway` with a descriptive message
- Application errors → returned with appropriate HTTP status
- All errors logged to console (expandable to file/APM in production)

The frontend handles errors gracefully with:
- Per-request error state displayed as an error banner
- A retry button to re-trigger the fetch
- Skeleton loaders during pending states

---

## 8. Security Considerations

- `ACCESS_TOKEN` is stored as an environment variable, never hardcoded
- `.env` is git-ignored
- CORS is enabled (configurable per environment in production)
- No user input is passed directly to the external API (prevents injection)

---

*Design document version 1.0 — May 2026*
