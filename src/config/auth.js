// Authentication configuration
// In production, this should be replaced with AWS Cognito or similar

export const AUTH_CONFIG = {
  // These should come from environment variables in production
  enabled: import.meta.env.VITE_AUTH_ENABLED !== 'false',
  provider: import.meta.env.VITE_AUTH_PROVIDER || 'local', // 'local', 'cognito', 'oauth'
  
  // AWS Cognito configuration (if using)
  cognito: {
    region: import.meta.env.VITE_AWS_REGION,
    userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
    clientId: import.meta.env.VITE_AWS_COGNITO_CLIENT_ID,
  }
};

// WARNING: This is for development only
// In production, use proper authentication service
export const validateCredentials = async (username, password) => {
  if (import.meta.env.PROD) {
    throw new Error('Local authentication not available in production');
  }
  
  // Development only - remove in production
  const VALID_USERNAME = import.meta.env.VITE_DEMO_USERNAME || 'admin';
  const VALID_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'ai-metrics-2026';
  
  return username === VALID_USERNAME && password === VALID_PASSWORD;
};

// Session management
export const SESSION_CONFIG = {
  tokenKey: 'auth_token',
  expiryKey: 'auth_expiry',
  duration: 24 * 60 * 60 * 1000, // 24 hours
};

export const setSession = (token) => {
  const expiry = Date.now() + SESSION_CONFIG.duration;
  localStorage.setItem(SESSION_CONFIG.tokenKey, token);
  localStorage.setItem(SESSION_CONFIG.expiryKey, expiry.toString());
};

export const getSession = () => {
  const token = localStorage.getItem(SESSION_CONFIG.tokenKey);
  const expiry = localStorage.getItem(SESSION_CONFIG.expiryKey);
  
  if (!token || !expiry) return null;
  
  if (Date.now() > parseInt(expiry)) {
    clearSession();
    return null;
  }
  
  return token;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_CONFIG.tokenKey);
  localStorage.removeItem(SESSION_CONFIG.expiryKey);
};

export const isAuthenticated = () => {
  return getSession() !== null;
};
