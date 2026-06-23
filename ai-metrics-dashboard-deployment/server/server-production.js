import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import { feedbackDB, useCaseDB } from './db-simple.js';
import { securityHeaders, corsOptions, apiLimiter, requestSizeLimits } from './middleware/security.js';
import { validateFeedback, validateUseCase, validateId, sanitizeInput } from './middleware/validation.js';
import logger, { requestLogger, errorLogger } from './middleware/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy (required for rate limiting behind load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(compression());

// Request parsing with size limits
app.use(bodyParser.json(requestSizeLimits.json));
app.use(bodyParser.urlencoded(requestSizeLimits.urlencoded));

// Input sanitization
app.use(sanitizeInput);

// Logging
app.use(requestLogger);

// Rate limiting
app.use('/api/', apiLimiter);

logger.info('✅ Database initialized');
logger.info(`🚀 Starting server in ${NODE_ENV} mode`);

// Health check (no rate limiting)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    version: '1.0.0',
    environment: NODE_ENV
  });
});

// Feedback routes
app.get('/api/feedback', async (req, res, next) => {
  try {
    const feedback = await feedbackDB.getAll();
    logger.info(`Retrieved ${feedback.length} feedback items`);
    res.json(feedback);
  } catch (error) {
    logger.error('Error fetching feedback:', error);
    next(error);
  }
});

app.post('/api/feedback', validateFeedback, async (req, res, next) => {
  try {
    const feedback = await feedbackDB.create(req.body);
    logger.info('Feedback created', { id: feedback.id });
    res.status(201).json(feedback);
  } catch (error) {
    logger.error('Error creating feedback:', error);
    next(error);
  }
});

app.get('/api/feedback/:id', validateId, async (req, res, next) => {
  try {
    const feedback = await feedbackDB.getById(req.params.id);
    if (feedback) {
      res.json(feedback);
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    logger.error('Error fetching feedback:', error);
    next(error);
  }
});

app.delete('/api/feedback/:id', validateId, async (req, res, next) => {
  try {
    await feedbackDB.delete(req.params.id);
    logger.info('Feedback deleted', { id: req.params.id });
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    logger.error('Error deleting feedback:', error);
    next(error);
  }
});

// Use case routes
app.get('/api/usecases', async (req, res, next) => {
  try {
    const useCases = await useCaseDB.getAll();
    logger.info(`Retrieved ${useCases.length} use cases`);
    res.json(useCases);
  } catch (error) {
    logger.error('Error fetching use cases:', error);
    next(error);
  }
});

app.post('/api/usecases', validateUseCase, async (req, res, next) => {
  try {
    const useCase = await useCaseDB.create(req.body);
    logger.info('Use case created', { id: useCase.id });
    res.status(201).json(useCase);
  } catch (error) {
    logger.error('Error creating use case:', error);
    next(error);
  }
});

app.get('/api/usecases/:id', async (req, res, next) => {
  try {
    const useCase = await useCaseDB.getById(req.params.id);
    if (useCase) {
      res.json(useCase);
    } else {
      res.status(404).json({ error: 'Use case not found' });
    }
  } catch (error) {
    logger.error('Error fetching use case:', error);
    next(error);
  }
});

// Export all data (consider adding authentication)
app.get('/api/export', async (req, res, next) => {
  try {
    const feedback = await feedbackDB.getAll();
    const useCases = await useCaseDB.getAll();
    logger.info('Data exported');
    res.json({
      feedback,
      useCases,
      exportDate: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error exporting data:', error);
    next(error);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'The requested resource was not found',
    path: req.url
  });
});

// Error logging
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = NODE_ENV === 'production' 
    ? 'An error occurred' 
    : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📊 API endpoints available at http://localhost:${PORT}/api`);
  logger.info(`🔒 Security headers enabled`);
  logger.info(`⚡ Rate limiting enabled`);
  logger.info(`📝 Logging enabled`);
});

export default app;
