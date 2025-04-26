const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

function errorHandler(err, req, res, next) {
  // Log all errors
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // If it's an operational error (one we threw intentionally)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // For unhandled errors
  return res.status(500).json({
    error: "ארעה שגיאה. נסו שוב מאוחר יותר",
  });
}

module.exports = errorHandler;
