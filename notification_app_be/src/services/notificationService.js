/**
 * Notification Service
 * (Triggering nodemon restart to pick up new ENV token)
 * Responsible for fetching, filtering, sorting, and prioritizing notifications
 * from the external evaluation API.
 */

const axios = require("axios");

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────

const EXTERNAL_API_URL = `${process.env.EXTERNAL_API_BASE_URL}/notifications`;

/**
 * Priority map for notification types.
 * Lower number = higher priority (used for sorting ascending by priority rank).
 *
 * Placement → 1 (highest)
 * Event     → 2 (medium)
 * Others    → 3 (lowest)
 */
const PRIORITY_MAP = {
  placement: 1,
  event: 2,
};

/**
 * Returns the numeric priority of a notification type.
 * @param {string} type - Notification type string (case insensitive)
 * @returns {number} Priority rank (1 = highest, 3 = lowest)
 */
function getPriority(type = "") {
  const normalized = type.toLowerCase();
  return PRIORITY_MAP[normalized] ?? 3; // default = 3 (lowest)
}

// ─────────────────────────────────────────────
//  Core Fetch Function
// ─────────────────────────────────────────────

let currentToken = null;

async function getAuthToken() {
  console.log("[NotificationService] Fetching new auth token...");
  const authUrl = process.env.AUTH_API_URL;
  
  const payload = {
    email: process.env.CLIENT_EMAIL,
    name: process.env.CLIENT_NAME,
    rollNo: process.env.CLIENT_ROLLNO,
    accessCode: process.env.CLIENT_ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  };

  try {
    const response = await axios.post(authUrl, payload);
    if (response.data && response.data.access_token) {
      currentToken = response.data.access_token;
      return currentToken;
    }
    throw new Error("Token not found in response");
  } catch (err) {
    console.error("[NotificationService] Failed to fetch auth token:", err.message);
    throw err;
  }
}

/**
 * Fetches all notifications from the external API.
 * @param {boolean} isRetry - Prevents infinite retry loops
 * @returns {Promise<Array>} Array of notification objects
 * @throws Will throw an error if the API call fails
 */
async function fetchAllNotifications(isRetry = false) {
  if (!currentToken) {
    await getAuthToken();
  }

  console.log(`[NotificationService] Fetching from external API: ${EXTERNAL_API_URL}`);

  try {
    const response = await axios.get(EXTERNAL_API_URL, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    const notifications = response.data?.notifications;

    if (!Array.isArray(notifications)) {
      throw new Error("Unexpected API response format: 'notifications' array not found.");
    }

    console.log(`[NotificationService] Fetched ${notifications.length} notifications.`);
    return notifications;
  } catch (error) {
    // If we get a 401 Unauthorized, token might be expired. Retry once.
    if (error.response && error.response.status === 401 && !isRetry) {
      console.log("[NotificationService] Token expired or invalid. Fetching new token...");
      currentToken = null; // Invalidate current token
      return fetchAllNotifications(true); // Retry once
    }
    throw error;
  }
}

// ─────────────────────────────────────────────
//  Business Logic Functions
// ─────────────────────────────────────────────

/**
 * Parses a timestamp string to a Date object for comparison.
 * @param {string} timestamp - "YYYY-MM-DD HH:mm:ss" format
 * @returns {Date}
 */
function parseTimestamp(timestamp) {
  // Replace space with 'T' to make it ISO-compatible
  return new Date(timestamp.replace(" ", "T"));
}

/**
 * GET /notifications/priority
 *
 * Fetches all notifications, applies priority ranking:
 *   Placement → highest, Event → medium, Others → lowest
 * Sorts by: 1) Priority (ascending), 2) Timestamp (latest first)
 * Returns top 10.
 *
 * @returns {Promise<Array>} Top 10 priority-sorted notifications
 */
async function getPriorityNotifications() {
  const notifications = await fetchAllNotifications();

  const sorted = notifications.sort((a, b) => {
    const priorityA = getPriority(a.Type);
    const priorityB = getPriority(b.Type);

    // Sort by priority first (lower rank = higher priority)
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // If same priority, sort by timestamp descending (latest first)
    return parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp);
  });

  // Enrich each notification with its priority label and rank
  const enriched = sorted.slice(0, 10).map((n) => ({
    ...n,
    priorityRank: getPriority(n.Type),
    priorityLabel: getPriorityLabel(n.Type),
  }));

  return enriched;
}

/**
 * GET /notifications/type/:type
 *
 * Filters notifications by type (case insensitive).
 * Sorts by latest timestamp first.
 *
 * @param {string} type - The notification type to filter by
 * @returns {Promise<Array>} Filtered and sorted notifications
 */
async function getNotificationsByType(type) {
  const notifications = await fetchAllNotifications();

  const filtered = notifications
    .filter((n) => n.Type?.toLowerCase() === type.toLowerCase())
    .sort((a, b) => parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp));

  console.log(
    `[NotificationService] Filtered by type "${type}": ${filtered.length} results.`
  );

  return filtered;
}

/**
 * GET /notifications/latest
 *
 * Returns the 5 most recent notifications by timestamp.
 *
 * @returns {Promise<Array>} Latest 5 notifications
 */
async function getLatestNotifications() {
  const notifications = await fetchAllNotifications();

  const sorted = notifications.sort(
    (a, b) => parseTimestamp(b.Timestamp) - parseTimestamp(a.Timestamp)
  );

  return sorted.slice(0, 5);
}

/**
 * Returns a human-readable priority label.
 * @param {string} type
 * @returns {string}
 */
function getPriorityLabel(type = "") {
  const rank = getPriority(type);
  if (rank === 1) return "High";
  if (rank === 2) return "Medium";
  return "Low";
}

// ─────────────────────────────────────────────
//  Exports
// ─────────────────────────────────────────────
module.exports = {
  getPriorityNotifications,
  getNotificationsByType,
  getLatestNotifications,
  fetchAllNotifications,
};
