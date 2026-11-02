// Global error handler middleware
// This is called whenever next(error) is used in any route or controller

const errorHandler = (err, req, res, next) => {
  // Default status code is 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
