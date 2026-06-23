import express from 'express';
import { body } from 'express-validator';
import { authenticateUser, hashPassword, validatePassword, ROLES } from '../auth/authService.js';
import { authenticate, requireAdmin } from '../auth/authMiddleware.js';
import { userDB } from '../db-simple.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Login - with strict rate limiting
router.post('/login',
  authLimiter, // Apply strict rate limiting to login
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const result = await authenticateUser(username, password);
      
      if (!result.success) {
        return res.status(401).json({ 
          error: 'Authentication failed',
          message: result.message 
        });
      }
      
      res.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Login failed',
        message: 'An error occurred during login' 
      });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await userDB.getById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Change password - with password reset rate limiting
router.post('/change-password',
  authenticate,
  passwordResetLimiter, // Apply strict rate limiting to password changes
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').notEmpty().withMessage('New password is required'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Validate new password strength
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        return res.status(400).json({ 
          error: 'Invalid password',
          message: validation.errors 
        });
      }
      
      // Get user
      const user = await userDB.getById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verify current password
      const bcrypt = await import('bcryptjs');
      const isValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValid) {
        return res.status(401).json({ 
          error: 'Invalid password',
          message: 'Current password is incorrect' 
        });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password
      await userDB.update(user.id, { password: hashedPassword });
      
      res.json({ 
        success: true,
        message: 'Password changed successfully' 
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticate, (req, res) => {
  // In a more complex system, you might invalidate the token here
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

export default router;
