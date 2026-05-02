/**
 * Notification Routes
 * Defines all API endpoints for the campus notification system.
 *
 * Endpoints:
 *   GET /notifications/priority      - Top 10 priority-sorted notifications
 *   GET /notifications/type/:type    - Notifications filtered by type
 *   GET /notifications/latest        - Latest 5 notifications
 */

const express = require("express");
const router = express.Router();
const {
  getPriorityNotifications,
  getNotificationsByType,
  getLatestNotifications,
  fetchAllNotifications,
} = require("../services/notificationService");

// ─────────────────────────────────────────────
//  GET /notifications/priority
// ─────────────────────────────────────────────

/**
 * Returns the top 10 notifications sorted by priority and then by latest timestamp.
 * Priority order: Placement (High) > Event (Medium) > Others (Low)
 */
router.get("/priority", async (req, res, next) => {
  try {
    console.log("[Route] GET /notifications/priority");
    const notifications = await getPriorityNotifications();

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error); // Delegate to global error handler
  }
});

// ─────────────────────────────────────────────
//  GET /notifications/type/:type
// ─────────────────────────────────────────────

/**
 * Returns notifications filtered by the given type.
 * Type is case-insensitive (e.g., "event", "Event", "EVENT" all work).
 * Sorted by latest timestamp first.
 *
 * Valid types: Event, Placement, Result (based on external API)
 */
router.get("/type/:type", async (req, res, next) => {
  try {
    const { type } = req.params;
    console.log(`[Route] GET /notifications/type/${type}`);

    // Validate that type is not empty
    if (!type || type.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Notification type parameter is required.",
      });
    }

    const notifications = await getNotificationsByType(type);

    res.json({
      success: true,
      filterType: type,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
//  GET /notifications/latest
// ─────────────────────────────────────────────

/**
 * Returns the 5 most recently timestamped notifications.
 */
router.get("/latest", async (req, res, next) => {
  try {
    console.log("[Route] GET /notifications/latest");
    const notifications = await getLatestNotifications();

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────
//  GET /notifications/all  (bonus: useful for frontend pagination)
// ─────────────────────────────────────────────

/**
 * Returns all notifications from the external API (unsorted).
 * Supports optional query param: ?sort=latest
 */
router.get("/all", async (req, res, next) => {
  try {
    console.log("[Route] GET /notifications/all");
    let notifications = await fetchAllNotifications();

    // Optional sort by latest
    if (req.query.sort === "latest") {
      notifications = notifications.sort(
        (a, b) =>
          new Date(b.Timestamp.replace(" ", "T")) -
          new Date(a.Timestamp.replace(" ", "T"))
      );
    }

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
