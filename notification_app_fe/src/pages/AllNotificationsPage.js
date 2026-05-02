/**
 * AllNotificationsPage
 * Displays all notifications with pagination support (10 per page).
 */

import React, { useState, useEffect } from "react";
import NotificationCard from "../components/NotificationCard";
import { LoadingSkeleton, ErrorBanner, EmptyState, Pagination } from "../components/SharedUI";
import { useAllNotifications } from "../hooks/useNotifications";

import "../styles/Page.css";

const PAGE_SIZE = 10;

export default function AllNotificationsPage() {
  const { data: notifications, loading, error, refetch } = useAllNotifications("latest");
  const [currentPage, setCurrentPage] = useState(1);

  // When data loads, we don't pre-mark — cards mark themselves on scroll
  useEffect(() => {
    setCurrentPage(1); // reset on new data
  }, [notifications]);

  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const paginatedNotifications = notifications.slice(pageStart, pageStart + PAGE_SIZE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="page" id="all-notifications-page">
      {/* Page Header */}
      <header className="page-header">
        <p className="page-header__eyebrow">Campus Hub</p>
        <h1 className="page-header__title">All Notifications</h1>
        <p className="page-header__description">
          Stay up to date with the latest announcements, events, placements, and results
          from your campus.
        </p>
      </header>

      {/* Stats Row */}
      {!loading && !error && (
        <div className="stats-row">
          <div className="stat-chip">
            🔔 Total <span className="stat-chip__count">{notifications.length}</span>
          </div>
          <div className="stat-chip">
            📄 Page <span className="stat-chip__count">{currentPage}</span> of{" "}
            <span className="stat-chip__count">{totalPages || 1}</span>
          </div>
          <button className="refetch-btn" onClick={refetch} id="all-refetch-btn">
            🔄 Refresh
          </button>
        </div>
      )}

      {/* Error */}
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {/* Loading */}
      {loading && <LoadingSkeleton count={6} />}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <EmptyState
          icon="🔕"
          title="No notifications found"
          message="The system currently has no notifications. Please check back later."
        />
      )}

      {/* Notification List */}
      {!loading && !error && paginatedNotifications.length > 0 && (
        <>
          <div className="notification-list" aria-label="Notification list">
            {paginatedNotifications.map((notification, index) => (
              <NotificationCard
                key={notification.ID}
                notification={notification}
                animationDelay={index * 50}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
