/**
 * PriorityNotificationsPage
 * Displays top 10 priority-sorted notifications.
 * Priority: Placement > Event > Others
 */

import React from "react";
import NotificationCard from "../components/NotificationCard";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "../components/SharedUI";
import { usePriorityNotifications } from "../hooks/useNotifications";
import "../styles/Page.css";

const PRIORITY_DESCRIPTION = {
  1: { label: "High Priority", color: "#f59e0b", emoji: "🔴" },
  2: { label: "Medium Priority", color: "#10b981", emoji: "🟡" },
  3: { label: "Low Priority", color: "#6b7280", emoji: "🟢" },
};

export default function PriorityNotificationsPage() {
  const { data: notifications, loading, error, refetch } = usePriorityNotifications();

  // Group by priority rank for visual separation
  const groups = notifications.reduce((acc, n) => {
    const rank = n.priorityRank || 3;
    if (!acc[rank]) acc[rank] = [];
    acc[rank].push(n);
    return acc;
  }, {});

  return (
    <main className="page" id="priority-notifications-page">
      {/* Page Header */}
      <header className="page-header">
        <p className="page-header__eyebrow">Sorted View</p>
        <h1 className="page-header__title">⚡ Priority Notifications</h1>
        <p className="page-header__description">
          Top 10 notifications ranked by importance — Placement opportunities first,
          followed by Events, then general announcements.
        </p>
      </header>

      {/* Priority Legend */}
      {!loading && !error && (
        <div className="stats-row">
          <div className="stat-chip">🔴 Placement = High</div>
          <div className="stat-chip">🟡 Event = Medium</div>
          <div className="stat-chip">🟢 Others = Low</div>
          <button className="refetch-btn" onClick={refetch} id="priority-refetch-btn">
            🔄 Refresh
          </button>
        </div>
      )}

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Loading */}
      {loading && <LoadingSkeleton count={5} />}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <EmptyState
          icon="⚡"
          title="No priority notifications"
          message="There are currently no notifications to rank."
        />
      )}

      {/* Grouped by Priority */}
      {!loading && !error && notifications.length > 0 && (
        <div>
          {[1, 2, 3].map((rank) => {
            const group = groups[rank];
            if (!group || group.length === 0) return null;
            const meta = PRIORITY_DESCRIPTION[rank];

            return (
              <section key={rank} style={{ marginBottom: "32px" }}>
                {/* Group label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{meta.emoji}</span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: meta.color,
                    }}
                  >
                    {meta.label}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {group.length} notification{group.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="notification-list">
                  {group.map((notification, index) => (
                    <NotificationCard
                      key={notification.ID}
                      notification={notification}
                      showPriority
                      animationDelay={index * 60}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
