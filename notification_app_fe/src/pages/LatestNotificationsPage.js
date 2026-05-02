/**
 * LatestNotificationsPage
 * Displays the 5 most recent notifications based on timestamp.
 */

import React from "react";
import NotificationCard from "../components/NotificationCard";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "../components/SharedUI";
import { useLatestNotifications } from "../hooks/useNotifications";
import "../styles/Page.css";

export default function LatestNotificationsPage() {
  const { data: notifications, loading, error, refetch } = useLatestNotifications();

  return (
    <main className="page" id="latest-notifications-page">
      {/* Page Header */}
      <header className="page-header">
        <p className="page-header__eyebrow">Recent Activity</p>
        <h1 className="page-header__title">🕐 Latest Notifications</h1>
        <p className="page-header__description">
          The 5 most recent notifications from your campus — sorted by newest timestamp
          first.
        </p>
      </header>

      {/* Stats + Refresh */}
      {!loading && !error && (
        <div className="stats-row">
          <div className="stat-chip">
            🕐 Showing <span className="stat-chip__count">{notifications.length}</span>{" "}
            most recent
          </div>
          <button className="refetch-btn" onClick={refetch} id="latest-refetch-btn">
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
          icon="🕐"
          title="No recent notifications"
          message="There are currently no notifications from the campus."
        />
      )}

      {/* Notification List */}
      {!loading && !error && notifications.length > 0 && (
        <div className="notification-list" aria-label="Latest notifications">
          {notifications.map((notification, index) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              animationDelay={index * 70}
            />
          ))}
        </div>
      )}
    </main>
  );
}
