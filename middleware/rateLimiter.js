const rateLimit = require('express-rate-limit');

// Applied to all routes — allows 100 requests per 1 minutes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,    // 1 minutes in milliseconds
  max: 100,                   // max requests per window per IP
  standardHeaders: true,      // sends limit info in response headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// Login/register — only 10 attempts per 1 minutes
// Prevents brute force password attacks
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 1 minutes.',
  },
});


const dashboardLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 80,               // 80 requests per minute
  message: {
    success: false,
    message: 'Too many dashboard requests. Slow down.',
  },
});

module.exports = { apiLimiter, authLimiter, dashboardLimiter };