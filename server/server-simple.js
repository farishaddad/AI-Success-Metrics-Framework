import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { generalLimiter } from './middleware/rateLimiter.js';
import { feedbackDB, useCaseDB, agentMetricsDB } from './db-simple.js';
import { initializeDefaultAdmin } from './auth/authService.js';
import { authenticate, requireAdmin } from './auth/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize default admin user
await initializeDefaultAdmin();

// CORS Configuration - Restrict to specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl, Python scripts, agent)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10 minutes
};

// Security Headers - Helmet Configuration
app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Strict Transport Security (HSTS)
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  },
  // X-Frame-Options
  frameguard: {
    action: 'deny' // Prevent clickjacking
  },
  // X-Content-Type-Options
  noSniff: true, // Prevent MIME type sniffing
  // X-XSS-Protection
  xssFilter: true, // Enable XSS filter
  // Referrer-Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  // X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none'
  },
  // X-Download-Options
  ieNoOpen: true, // Prevent IE from executing downloads
  // X-DNS-Prefetch-Control
  dnsPrefetchControl: {
    allow: false
  },
  // Hide X-Powered-By header
  hidePoweredBy: true
}));

// Additional custom security headers
app.use((req, res, next) => {
  // Permissions Policy (formerly Feature Policy)
  res.setHeader('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  // X-Content-Type-Options (additional enforcement)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Cache-Control for sensitive data
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '1mb' })); // Limit request size
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Apply general rate limiter to all API routes
app.use('/api/', generalLimiter);

// Input sanitization middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potential XSS patterns
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
});

console.log(`✅ Server configured for ${NODE_ENV} environment`);
console.log(`✅ CORS allowed origins: ${allowedOrigins.join(', ')}`);
console.log(`✅ Security headers enabled (Helmet + Custom headers)`);
console.log(`✅ Rate limiting enabled (General: 100/15min, Auth: 5/15min, Create: 30/15min)`);

// Authentication routes (public)
app.use('/api/auth', authRoutes);

// User management routes (admin only)
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Feedback routes (require authentication)
app.get('/api/feedback', authenticate, async (req, res) => {
  try {
    const feedback = await feedbackDB.getAll();
    res.json(feedback);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.post('/api/feedback', authenticate, async (req, res) => {
  try {
    const feedback = await feedbackDB.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

app.get('/api/feedback/:id', authenticate, async (req, res) => {
  try {
    const feedback = await feedbackDB.getById(req.params.id);
    if (feedback) {
      res.json(feedback);
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.delete('/api/feedback/:id', authenticate, async (req, res) => {
  try {
    await feedbackDB.delete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// Use case routes (require authentication)
app.get('/api/usecases', authenticate, async (req, res) => {
  try {
    const useCases = await useCaseDB.getAll();
    res.json(useCases);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch use cases' });
  }
});

app.post('/api/usecases', authenticate, async (req, res) => {
  try {
    const useCase = await useCaseDB.create(req.body);
    res.status(201).json(useCase);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create use case' });
  }
});

app.get('/api/usecases/:id', authenticate, async (req, res) => {
  try {
    const useCase = await useCaseDB.getById(req.params.id);
    if (useCase) {
      res.json(useCase);
    } else {
      res.status(404).json({ error: 'Use case not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch use case' });
  }
});

// Export all data (admin only)
app.get('/api/export', authenticate, requireAdmin, async (req, res) => {
  try {
    const feedback = await feedbackDB.getAll();
    const useCases = await useCaseDB.getAll();
    res.json({
      feedback,
      useCases,
      exportDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// ==================== AGENT METRICS ROUTES ====================

// Get all agent metrics (no auth required for agent to send metrics)
app.get('/api/agent-metrics', async (req, res) => {
  try {
    const metrics = await agentMetricsDB.getAll();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching agent metrics:', error);
    res.status(500).json({ error: 'Failed to fetch agent metrics' });
  }
});

// Get agent metrics by session ID
app.get('/api/agent-metrics/session/:sessionId', async (req, res) => {
  try {
    const metrics = await agentMetricsDB.getBySessionId(req.params.sessionId);
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching session metrics:', error);
    res.status(500).json({ error: 'Failed to fetch session metrics' });
  }
});

// Get agent metrics summary
app.get('/api/agent-metrics/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await agentMetricsDB.getSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    console.error('Error fetching metrics summary:', error);
    res.status(500).json({ error: 'Failed to fetch metrics summary' });
  }
});

// Create agent metrics (no auth required for agent to send metrics)
app.post('/api/agent-metrics', async (req, res) => {
  try {
    const metrics = await agentMetricsDB.create(req.body);
    res.status(201).json(metrics);
  } catch (error) {
    console.error('Error creating agent metrics:', error);
    res.status(500).json({ error: 'Failed to create agent metrics' });
  }
});

// Delete agent metrics (admin only)
app.delete('/api/agent-metrics/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await agentMetricsDB.delete(req.params.id);
    res.json({ message: 'Agent metrics deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent metrics:', error);
    res.status(500).json({ error: 'Failed to delete agent metrics' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
