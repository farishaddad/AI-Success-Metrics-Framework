import rateLimit from 'express-rate-limit';

const NODE_ENV = process.env.NODE_ENV || 'development';

// General API rate limiter - 100 requests per 15 minutes per IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health check in development
  skip: (req) => NODE_ENV === 'development' && req.path === '/api/health',
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiter for authentication endpoints - 5 requests per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    console.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many login attempts. Please try again in 15 minutes.',
      retryAfter: '15 minutes'
    });
  }
});

// Moderate rate limiter for data modification - 30 requests per 15 minutes per IP
export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 create/update/delete requests per windowMs
  message: {
    error: 'Too many data modification requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Create rate limit exceeded for IP: ${req.ip} on path: ${req.path}`);
    res.status(429).json({
      error: 'Too many data modification requests. Please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiter for password reset - 3 requests per hour per IP
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset attempts per hour
  message: {
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Password reset rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many password reset attempts. Please try again in 1 hour.',
      retryAfter: '1 hour'
    });
  }
});
