import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Get all users
export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return await response.json();
};

// Create new user
export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create user');
  }

  return data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user');
  }

  return data;
};

// Toggle user active status
export const toggleUserActive = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}/toggle-active`, {
    method: 'PATCH',
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to toggle user status');
  }

  return data;
};

// Reset user password
export const resetUserPassword = async (id, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to reset password');
  }

  return data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete user');
  }

  return data;
};
