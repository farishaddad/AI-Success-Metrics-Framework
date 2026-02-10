import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userDB } from '../db-simple.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

// User roles
export const ROLES = {
  ADMIN: 'admin',
  GUEST: 'guest'
};

// Hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
};

// Compare password
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authenticate user
export const authenticateUser = async (username, password) => {
  try {
    // Find user by username
    const user = await userDB.getByUsername(username);
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    // Check if user is active
    if (!user.isActive) {
      return { success: false, message: 'Account is disabled' };
    }
    
    // Compare password
    const isValid = await comparePassword(password, user.password);
    
    if (!isValid) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    // Update last login
    await userDB.updateLastLogin(user.id);
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      token,
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  }
};

// Create default admin user if not exists
export const initializeDefaultAdmin = async () => {
  try {
    const adminExists = await userDB.getByUsername('admin');
    
    if (!adminExists) {
      const hashedPassword = await hashPassword('Admin@2026!');
      
      await userDB.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: ROLES.ADMIN,
        fullName: 'System Administrator',
        isActive: true
      });
      
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: Admin@2026!');
      console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
