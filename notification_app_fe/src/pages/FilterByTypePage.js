/**
 * FilterByTypePage
 * Displays notifications filtered by a specific type (Event, Placement, Result).
 * The active type is passed as a prop from the router/App.
 */

import React from "react";
import NotificationCard from "../components/NotificationCard";
import { LoadingSkeleton, ErrorBanner, EmptyState } from "../components/SharedUI";
import { useNotificationsByType } from "../hooks/useNotifications";
import "../styles/Page.css";

const TYPE_META = {
  placement: {
    icon: "💼",
    color: "var(--color-placement)",
    description:
      "All campus placement drives, company visits, and career opportunity announcements.",
    eyebrow: "Career Opportunities",
  },
  event: {
    icon: "📅",
    color: "var(--color-event)",
    description:
      "Upcoming campus events, workshops, seminars, fests, and cultural programs.",
    eyebrow: "Campus Events",
  },
  result: {
    icon: "📊",
    color: "var(--color-result)",
    description:
      "Exam results, grade announcements, academic performance updates, and merit lists.",
    eyebrow: "Academic Results",
  },
};

export default function FilterByTypePage({ type }) {
  const { data: notifications, loading, error, refetch } = useNotificationsByType(type);

  const meta = TYPE_META[type?.toLowerCase()] || {
    icon: "📣",
    color: "var(--color-other)",
    description: `All notifications of type "${type}".`,
    eyebrow: "Filtered View",
  };

  const displayType = type
    ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    : "Unknown";

  return (
    <main className="page" id={`filter-${type}-page`}>
      {/* Page Header */}
      <header className="page-header">
        <p className="page-header__eyebrow" style={{ color: meta.color }}>
          {meta.eyebrow}
        </p>
        <h1 className="page-header__title">
          {meta.icon} {displayType} Notifications
        </h1>
        <p className="page-header__description">{meta.description}</p>
      </header>

      {/* Stats + Refresh */}
      {!loading && !error && (
        <div className="stats-row">
          <div className="stat-chip">
            {meta.icon} Found{" "}
            <span className="stat-chip__count">{notifications.length}</span>{" "}
            {displayType.toLowerCase()} notifications
          </div>
          <button
            className="refetch-btn"
            onClick={refetch}
            id={`filter-${type}-refetch-btn`}
          >
            🔄 Refresh
          </button>
        </div>
      )}

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Loading */}
      {loading && <LoadingSkeleton count={4} />}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <EmptyState
          icon={meta.icon}
          title={`No ${displayType} notifications`}
          message={`There are currently no ${displayType.toLowerCase()} notifications to display.`}
        />
      )}

      {/* Notification List */}
      {!loading && !error && notifications.length > 0 && (
        <div
          className="notification-list"
          aria-label={`${displayType} notifications list`}
        >
          {notifications.map((notification, index) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              animationDelay={index * 60}
            />
          ))}
        </div>
      )}
    </main>
  );
}
