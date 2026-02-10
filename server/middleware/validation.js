import { body, param, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Feedback validation rules
export const validateFeedback = [
  body('pageName')
    .trim()
    .notEmpty().withMessage('Page name is required')
    .isLength({ max: 200 }).withMessage('Page name too long'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name too long')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name contains invalid characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('details')
    .trim()
    .notEmpty().withMessage('Details are required')
    .isLength({ min: 10, max: 5000 }).withMessage('Details must be between 10 and 5000 characters'),
  body('timestamp')
    .notEmpty().withMessage('Timestamp is required')
    .isISO8601().withMessage('Invalid timestamp format'),
  handleValidationErrors
];

// Use case validation rules
export const validateUseCase = [
  body('id')
    .notEmpty().withMessage('ID is required')
    .isLength({ max: 50 }).withMessage('ID too long'),
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 200 }).withMessage('Name too long'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description too long'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'pending', 'completed']).withMessage('Invalid status'),
  handleValidationErrors
];

// ID parameter validation
export const validateId = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  handleValidationErrors
];

// Sanitize input to prevent XSS
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potential XSS patterns
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};
