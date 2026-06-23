import 'dotenv/config';
import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { generalLimiter } from './middleware/rateLimiter.js';
import { feedbackDB, useCaseDB } from './db-simple.js';
import { initializeDefaultAdmin } from './auth/authService.js';
import { authenticate, requireAdmin } from './auth/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize default admin user
await initializeDefaultAdmin();

// CORS Configuration - Include HTTPS origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'https://localhost:3000', 'http://localhost:5173', 'https://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && NODE_ENV === 'development') {
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
  maxAge: 600
};

// Security Headers - Helmet Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  ieNoOpen: true,
  dnsPrefetchControl: { allow: false },
  hidePoweredBy: true
}));

// Additional custom security headers
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Apply general rate limiter
app.use('/api/', generalLimiter);

// Input sanitization middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    https: req.secure,
    protocol: req.protocol
  });
});

// Feedback routes
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

// Use case routes
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

// Export all data
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

// HTTPS Server Configuration
if (NODE_ENV === 'development') {
  try {
    const certPath = path.join(__dirname, '..', 'certs', 'localhost.pem');
    const keyPath = path.join(__dirname, '..', 'certs', 'localhost-key.pem');
    
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      
      https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
        console.log(`🔒 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
        console.log(`📊 HTTPS API endpoints available at https://localhost:${HTTPS_PORT}/api`);
        console.log(`✅ SSL/TLS enabled with local certificates`);
      });
    } else {
      console.warn('⚠️  SSL certificates not found at:');
      console.warn(`   Certificate: ${certPath}`);
      console.warn(`   Key: ${keyPath}`);
      console.warn('');
      console.warn('To enable HTTPS in development:');
      console.warn('1. Install mkcert: brew install mkcert (macOS)');
      console.warn('2. Install local CA: mkcert -install');
      console.warn('3. Generate certificates: mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1');
      console.warn('');
      console.warn('Continuing with HTTP only...');
    }
  } catch (error) {
    console.error('❌ Failed to start HTTPS server:', error.message);
    console.warn('Continuing with HTTP only...');
  }
}

// HTTP Server (always available)
app.listen(PORT, () => {
  console.log(`🚀 HTTP Server running on http://localhost:${PORT}`);
  console.log(`📊 HTTP API endpoints available at http://localhost:${PORT}/api`);
});
