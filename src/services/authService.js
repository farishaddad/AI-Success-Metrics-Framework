const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_URL environment variable is required');
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Get stored token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get stored user
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'admin';
};

// Login
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and user
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    const token = getToken();
    
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user from API
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    const user = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};
