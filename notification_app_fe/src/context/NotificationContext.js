/**
 * NotificationContext
 * Provides global notification state management across the app.
 * Tracks viewed notifications to highlight new vs viewed.
 */

import React, { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  // Set of notification IDs that have been viewed
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("campus_viewed_ids");
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });

  /**
   * Mark one or more notification IDs as viewed.
   * Persists to localStorage for cross-session tracking.
   */
  const markAsViewed = useCallback((ids) => {
    setViewedIds((prev) => {
      const updated = new Set([...prev, ...(Array.isArray(ids) ? ids : [ids])]);
      try {
        localStorage.setItem("campus_viewed_ids", JSON.stringify([...updated]));
      } catch {
        // localStorage might be unavailable in some environments
      }
      return updated;
    });
  }, []);

  /**
   * Check if a single notification has been viewed.
   */
  const isViewed = useCallback(
    (id) => viewedIds.has(id),
    [viewedIds]
  );

  /**
   * Clear all viewed state (for testing/reset).
   */
  const clearViewed = useCallback(() => {
    setViewedIds(new Set());
    localStorage.removeItem("campus_viewed_ids");
  }, []);

  return (
    <NotificationContext.Provider
      value={{ viewedIds, markAsViewed, isViewed, clearViewed }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return ctx;
}
