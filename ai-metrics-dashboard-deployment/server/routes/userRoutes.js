import express from 'express';
import { body, param } from 'express-validator';
import { hashPassword, validatePassword, ROLES } from '../auth/authService.js';
import { authenticate, requireAdmin } from '../auth/authMiddleware.js';
import { userDB } from '../db-simple.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { createLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// All user routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await userDB.getAll();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by ID (admin only)
router.get('/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const user = await userDB.getById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  }
);

// Create new user (admin only) - with rate limiting
router.post('/',
  createLimiter, // Apply rate limiting to user creation
  [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    body('password')
      .notEmpty().withMessage('Password is required'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('fullName')
      .trim()
      .notEmpty().withMessage('Full name is required')
      .isLength({ max: 100 }).withMessage('Full name too long'),
    body('role')
      .isIn([ROLES.ADMIN, ROLES.GUEST]).withMessage('Invalid role'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { username, password, email, fullName, role } = req.body;
      
      // Check if username already exists
      const existingUser = await userDB.getByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Username already exists',
          message: 'This username is already taken' 
        });
      }
      
      // Check if email already exists
      const existingEmail = await userDB.getByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ 
          error: 'Email already exists',
          message: 'This email is already registered' 
        });
      }
      
      // Validate password strength
      const validation = validatePassword(password);
      if (!validation.isValid) {
        return res.status(400).json({ 
          error: 'Invalid password',
          message: validation.errors 
        });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const newUser = await userDB.create({
        username,
        password: hashedPassword,
        email,
        fullName,
        role,
        isActive: true
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// Update user (admin only)
router.put('/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('fullName')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Full name too long'),
    body('role')
      .optional()
      .isIn([ROLES.ADMIN, ROLES.GUEST]).withMessage('Invalid role'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { email, fullName, role } = req.body;
      
      // Check if user exists
      const user = await userDB.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Prevent changing own role
      if (user.id === req.user.id && role && role !== user.role) {
        return res.status(400).json({ 
          error: 'Cannot change own role',
          message: 'You cannot change your own role' 
        });
      }
      
      // Check if email is already used by another user
      if (email && email !== user.email) {
        const existingEmail = await userDB.getByEmail(email);
        if (existingEmail && existingEmail.id !== user.id) {
          return res.status(400).json({ 
            error: 'Email already exists',
            message: 'This email is already registered' 
          });
        }
      }
      
      // Update user
      const updateData = {};
      if (email) updateData.email = email;
      if (fullName) updateData.fullName = fullName;
      if (role) updateData.role = role;
      
      const updatedUser = await userDB.update(user.id, updateData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

// Toggle user active status (admin only)
router.patch('/:id/toggle-active',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const user = await userDB.getById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Prevent deactivating own account
      if (user.id === req.user.id) {
        return res.status(400).json({ 
          error: 'Cannot deactivate own account',
          message: 'You cannot deactivate your own account' 
        });
      }
      
      const updatedUser = await userDB.toggleActive(user.id);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Toggle active error:', error);
      res.status(500).json({ error: 'Failed to toggle user status' });
    }
  }
);

// Reset user password (admin only) - with strict rate limiting
router.post('/:id/reset-password',
  passwordResetLimiter, // Apply strict rate limiting to password resets
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    body('newPassword').notEmpty().withMessage('New password is required'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      
      const user = await userDB.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Validate password strength
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        return res.status(400).json({ 
          error: 'Invalid password',
          message: validation.errors 
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password
      await userDB.update(user.id, { password: hashedPassword });
      
      res.json({ 
        success: true,
        message: 'Password reset successfully' 
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }
);

// Delete user (admin only)
router.delete('/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid user ID'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const user = await userDB.getById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Prevent deleting own account
      if (user.id === req.user.id) {
        return res.status(400).json({ 
          error: 'Cannot delete own account',
          message: 'You cannot delete your own account' 
        });
      }
      
      await userDB.delete(user.id);
      
      res.json({ 
        success: true,
        message: 'User deleted successfully' 
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

export default router;
