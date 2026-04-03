const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Invalid MongoDB ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found (invalid ID)`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token'; }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired'; }

  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;