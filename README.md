# 🏫 Campus Notifications System

> A full-stack campus notification hub built with **Node.js + Express** (backend) and **React** (frontend).  
> Fetches, prioritizes, filters, and displays real-time campus notifications.

---

## 👤 Candidate Details

| Field              | Value                              |
|--------------------|------------------------------------|
| **Name**           | Mohammad Hamza Khan                |
| **Email**          | mk8690@srmist.edu.in               |
| **Registration**   | RA2311003010914                    |
| **College**        | SRM Institute of Science and Technology |

---

## 📌 Project Description

The Campus Notification System solves the problem of fragmented, hard-to-find campus announcements by aggregating notifications from an external API and presenting them in a clean, prioritized interface.

Key capabilities:
- **Priority sorting** — Placement opportunities surface first, above events and general notices
- **Type filtering** — View only Placements, Events, or Results
- **New vs. Viewed tracking** — Unseen notifications are highlighted with a "NEW" badge (persisted via `localStorage`)
- **Pagination** — All Notifications view supports paginated browsing
- **Responsive design** — Works seamlessly on mobile and desktop

---

## 🗂️ Project Structure

```
afford/
├── notification_app_be/          # Node.js + Express Backend
│   ├── src/
│   │   ├── index.js              # Express server entry point
│   │   ├── routes/
│   │   │   └── notifications.js  # API route definitions
│   │   ├── services/
│   │   │   └── notificationService.js  # Business logic (fetch, sort, filter)
│   │   └── middleware/
│   │       └── errorHandler.js   # Global error handler
│   ├── .env.example              # Environment variable template
│   ├── .gitignore
│   └── package.json
│
├── notification_app_fe/          # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                # Root component + state-based routing
│   │   ├── index.js              # React entry point
│   │   ├── context/
│   │   │   └── NotificationContext.js  # Global viewed/new state
│   │   ├── hooks/
│   │   │   └── useNotifications.js     # Data fetching hooks
│   │   ├── components/
│   │   │   ├── Sidebar.js              # Navigation sidebar
│   │   │   ├── NotificationCard.js     # Individual notification card
│   │   │   └── SharedUI.js             # Skeleton, ErrorBanner, Pagination
│   │   ├── pages/
│   │   │   ├── AllNotificationsPage.js
│   │   │   ├── PriorityNotificationsPage.js
│   │   │   ├── LatestNotificationsPage.js
│   │   │   └── FilterByTypePage.js
│   │   └── styles/
│   │       ├── globals.css
│   │       ├── App.css
│   │       ├── Sidebar.css
│   │       ├── NotificationCard.css
│   │       └── Page.css
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── notification_system_design.md  # System design document
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd afford
```

---

### 2. Backend Setup

```bash
cd notification_app_be

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit `.env` and fill in your access token:

```env
EXTERNAL_API_BASE_URL=http://20.207.122.201/evaluation-service
ACCESS_TOKEN=your_actual_token_here
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd notification_app_fe

# Install dependencies
npm install

# Create your environment file (optional, defaults to localhost:5000)
cp .env.example .env
```

Start the frontend:

```bash
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000`

| Method | Endpoint                         | Description                                              |
|--------|----------------------------------|----------------------------------------------------------|
| GET    | `/`                              | Health check, API info                                   |
| GET    | `/notifications/all`             | All notifications (optional `?sort=latest`)              |
| GET    | `/notifications/priority`        | Top 10 by priority (Placement > Event > Others)          |
| GET    | `/notifications/type/:type`      | Filter by type (case-insensitive: event, placement, result) |
| GET    | `/notifications/latest`          | Latest 5 notifications by timestamp                      |

### Example Response

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "ID": "abc123",
      "Type": "Placement",
      "Message": "Google is visiting campus on May 10th for SDE roles.",
      "Timestamp": "2026-05-01 14:30:00",
      "priorityRank": 1,
      "priorityLabel": "High"
    }
  ]
}
```

---

## 🎨 Frontend Pages

| Page                      | Route (State)      | Description                                        |
|---------------------------|--------------------|----------------------------------------------------|
| All Notifications          | `all`              | Paginated list of all notifications                |
| Priority Notifications     | `priority`         | Top 10, grouped by priority level                  |
| Latest Notifications       | `latest`           | 5 most recent by timestamp                         |
| Filter: Placement          | `type-placement`   | Only placement drives and opportunities            |
| Filter: Event              | `type-event`       | Only campus events and workshops                   |
| Filter: Result             | `type-result`      | Only exam results and academic updates             |

---

## 🧪 Environment Variables Reference

### Backend (`notification_app_be/.env`)

| Variable                  | Description                              | Default   |
|---------------------------|------------------------------------------|-----------|
| `EXTERNAL_API_BASE_URL`   | Base URL of the external notification API | Required  |
| `ACCESS_TOKEN`            | Bearer token for external API auth        | Required  |
| `PORT`                    | Server port                              | `5000`    |
| `NODE_ENV`                | Environment (`development`/`production`) | `development` |

### Frontend (`notification_app_fe/.env`)

| Variable               | Description              | Default                    |
|------------------------|--------------------------|----------------------------|
| `REACT_APP_API_URL`    | Backend API base URL     | `http://localhost:5000`    |

---

## 📸 Screenshots

> _Screenshots to be added after deployment._

| Page                    | Preview |
|-------------------------|---------|
| All Notifications        | _(screenshot placeholder)_ |
| Priority Notifications   | _(screenshot placeholder)_ |
| Filter: Placement        | _(screenshot placeholder)_ |
| Mobile View              | _(screenshot placeholder)_ |

---

## 🧾 Design Document

See [`notification_system_design.md`](./notification_system_design.md) for:
- Priority logic explanation
- Sorting algorithm walkthrough
- Caching and scalability strategies
- Real-time event-driven architecture plan

---

## 📦 Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Backend   | Node.js, Express, Axios        |
| Frontend  | React 18, Vanilla CSS          |
| Dev Tools | Nodemon, Morgan                |
| Styling   | CSS Custom Properties, Google Fonts (Inter) |

---

## 🚀 Running Both Together

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd notification_app_be && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd notification_app_fe && npm start
```

Then open **http://localhost:3000** in your browser.

---

*Built for campus hiring evaluation — SRM Institute of Science and Technology, 2026*
