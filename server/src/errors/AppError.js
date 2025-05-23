class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Flag to identify controlled errors
  }
}

module.exports = AppError;
