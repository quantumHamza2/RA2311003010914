/**
 * NotificationCard Component
 * Renders a single notification with type badge, priority indicator,
 * timestamp, and new/viewed state.
 */

import React, { useEffect, useRef } from "react";
import { useNotificationContext } from "../context/NotificationContext";
import "../styles/NotificationCard.css";

const TYPE_ICON = {
  placement: "💼",
  event: "📅",
  result: "📊",
};

/**
 * Format "YYYY-MM-DD HH:mm:ss" → human readable
 */
function formatTimestamp(ts) {
  if (!ts) return "";
  try {
    const date = new Date(ts.replace(" ", "T"));
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return ts;
  }
}

/**
 * Returns CSS class name based on notification type.
 */
function getTypeCSSClass(type = "") {
  const t = type.toLowerCase();
  if (["placement", "event", "result"].includes(t)) return `card__type-badge--${t}`;
  return "card__type-badge--other";
}

/**
 * Notification Card
 * @param {Object} notification - Notification data object
 * @param {boolean} showPriority - Whether to show priority badge (for priority page)
 * @param {number} animationDelay - CSS animation delay in ms (for staggered list)
 */
export default function NotificationCard({
  notification,
  showPriority = false,
  animationDelay = 0,
}) {
  const { isViewed, markAsViewed } = useNotificationContext();
  const cardRef = useRef(null);
  const isNew = !isViewed(notification.ID);

  // Mark as viewed when card enters viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !isNew) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Brief delay so user actually sees the "NEW" badge
          const timer = setTimeout(() => markAsViewed(notification.ID), 2000);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [notification.ID, isNew, markAsViewed]);

  const typeLower = (notification.Type || "").toLowerCase();
  const icon = TYPE_ICON[typeLower] || "📣";

  return (
    <article
      ref={cardRef}
      className={`notification-card ${isNew ? "is-new" : ""}`}
      style={{
        animationDelay: `${animationDelay}ms`,
        "--type-color":
          typeLower === "placement"
            ? "var(--color-placement)"
            : typeLower === "event"
            ? "var(--color-event)"
            : typeLower === "result"
            ? "var(--color-result)"
            : "var(--color-other)",
      }}
      aria-label={`${notification.Type} notification`}
    >
      {/* Header */}
      <header className="card__header">
        <div className="card__badges">
          {/* Type badge */}
          <span className={`card__type-badge ${getTypeCSSClass(notification.Type)}`}>
            <span aria-hidden="true">{icon}</span>
            {notification.Type || "General"}
          </span>

          {/* New badge */}
          {isNew && (
            <span className="card__new-badge" aria-label="New notification">
              <span className="card__new-dot" aria-hidden="true" />
              NEW
            </span>
          )}

          {/* Priority badge (shown on priority page) */}
          {showPriority && notification.priorityLabel && (
            <span
              className={`card__priority-badge card__priority-badge--${notification.priorityLabel.toLowerCase()}`}
              aria-label={`Priority: ${notification.priorityLabel}`}
            >
              {notification.priorityLabel === "High" ? "🔴" : notification.priorityLabel === "Medium" ? "🟡" : "🟢"}
              {" "}{notification.priorityLabel} Priority
            </span>
          )}
        </div>

        {/* Timestamp */}
        <time
          className="card__timestamp"
          dateTime={notification.Timestamp}
          aria-label={`Posted at ${formatTimestamp(notification.Timestamp)}`}
        >
          🕐 {formatTimestamp(notification.Timestamp)}
        </time>
      </header>

      {/* Message */}
      <p className="card__message">{notification.Message}</p>

      {/* Footer */}
      <footer className="card__footer">
        <span className="card__id" aria-label={`ID: ${notification.ID}`}>
          #{notification.ID}
        </span>
      </footer>
    </article>
  );
}
