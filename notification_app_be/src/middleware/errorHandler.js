/**
 * Global Error Handler Middleware
 * Catches all errors passed via next(error) from route handlers.
 * Formats them into a consistent JSON response.
 */

const errorHandler = (err, req, res, next) => {
  // Log the error for server-side visibility
  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Handle axios-specific errors (from external API calls)
  if (err.isAxiosError) {
    const status = err.response?.status || 502;
    const message =
      err.response?.data?.message ||
      "Failed to reach the external notification API.";

    return res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Handle custom application errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
