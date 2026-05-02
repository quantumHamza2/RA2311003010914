/**
 * useNotifications — Custom Hook
 * Handles data fetching from the backend API with loading and error states.
 */

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Generic fetch hook for notifications endpoints.
 * @param {string} endpoint - The API endpoint path (e.g. "/notifications/all")
 * @param {Object} params - Optional query parameters
 */
export function useNotifications(endpoint, params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`, { params });
      setData(response.data.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch notifications";
      setError(message);
      console.error(`[useNotifications] Error fetching ${endpoint}:`, message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Convenience hooks for each specific endpoint
 */
export function useAllNotifications(sort = "latest") {
  return useNotifications("/notifications/all", { sort });
}

export function usePriorityNotifications() {
  return useNotifications("/notifications/priority");
}

export function useNotificationsByType(type) {
  return useNotifications(`/notifications/type/${type}`);
}

export function useLatestNotifications() {
  return useNotifications("/notifications/latest");
}
