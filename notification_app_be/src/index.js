/**
 * Campus Notifications System - Backend Server
 * Author: Mohammad Hamza Khan
 * Email: mk8690@srmist.edu.in
 * Registration: RA2311003010914
 * College: SRM Institute of Science and Technology
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notificationRoutes = require("./routes/notifications");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
//  Middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // HTTP request logger

// ─────────────────────────────────────────────
//  Health Check
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Campus Notifications API is running",
    version: "1.0.0",
    candidate: {
      name: "Mohammad Hamza Khan",
      registration: "RA2311003010914",
      college: "SRM Institute of Science and Technology",
    },
    endpoints: {
      priority: "GET /notifications/priority",
      byType: "GET /notifications/type/:type",
      latest: "GET /notifications/latest",
    },
  });
});

// ─────────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────────
app.use("/notifications", notificationRoutes);

// ─────────────────────────────────────────────
//  404 Handler
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─────────────────────────────────────────────
//  Global Error Handler
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
//  Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Campus Notifications API started`);
  console.log(`   ➜  Local:  http://localhost:${PORT}`);
  console.log(`   ➜  Env:    ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
