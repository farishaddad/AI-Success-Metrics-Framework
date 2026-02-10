import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, toggleUserActive, resetUserPassword, deleteUser } from '../services/userService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'guest'
  });
  const [newPassword, setNewPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (username.length > 50) {
      return 'Username must be less than 50 characters';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return '';
  };

  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    setPasswordValidation(validation);
    
    if (!password) {
      return 'Password is required';
    }
    if (!validation.minLength) {
      return 'Password must be at least 8 characters';
    }
    if (!validation.hasUppercase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!validation.hasLowercase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!validation.hasNumber) {
      return 'Password must contain at least one number';
    }
    if (!validation.hasSpecial) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (email.length > 255) {
      return 'Email must be less than 255 characters';
    }
    return '';
  };

  const validateFullName = (fullName) => {
    if (!fullName.trim()) {
      return 'Full name is required';
    }
    if (fullName.length < 2) {
      return 'Full name must be at least 2 characters';
    }
    if (fullName.length > 100) {
      return 'Full name must be less than 100 characters';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
      return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  };

  const validateForm = () => {
    const errors = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) errors.fullName = fullNameError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (name === 'password') {
      validatePassword(value);
    }
    
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to load users: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await createUser(formData);
      setShowCreateModal(false);
      setFormData({
        username: '',
        password: '',
        email: '',
        fullName: '',
        role: 'guest'
      });
      setValidationErrors({});
      setPasswordValidation({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
      });
      loadUsers();
      alert('User created successfully');
    } catch (err) {
      alert('Failed to create user: ' + err.message);
    }
  };

  const handleToggleActive = async (user) => {
    if (confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} ${user.username}?`)) {
      try {
        await toggleUserActive(user.id);
        loadUsers();
      } catch (err) {
        alert('Failed to toggle user status: ' + err.message);
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      alert(passwordError);
      return;
    }
    
    try {
      await resetUserPassword(selectedUser.id, newPassword);
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      setNewPassword('');
      setPasswordValidation({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
      });
      alert('Password reset successfully');
    } catch (err) {
      alert('Failed to reset password: ' + err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    if (confirm(`Are you sure you want to delete ${user.username}? This action cannot be undone.`)) {
      try {
        await deleteUser(user.id);
        loadUsers();
        alert('User deleted successfully');
      } catch (err) {
        alert('Failed to delete user: ' + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return <div className="user-management-loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>User Management</h1>
        <p className="user-management-subtitle">Manage user accounts and permissions</p>
        <button 
          className="btn-create-user"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New User
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={!user.isActive ? 'user-inactive' : ''}>
                <td className="username-cell">
                  <span className="username">{user.username}</span>
                </td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="date-cell">{formatDate(user.createdAt)}</td>
                <td className="date-cell">{formatDate(user.lastLogin)}</td>
                <td className="actions-cell">
                  <button
                    className="btn-action btn-toggle"
                    onClick={() => handleToggleActive(user)}
                    title={user.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {user.isActive ? '🔒' : '🔓'}
                  </button>
                  <button
                    className="btn-action btn-reset"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowResetPasswordModal(true);
                    }}
                    title="Reset Password"
                  >
                    🔑
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteUser(user)}
                    title="Delete User"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            No users found. Create your first user to get started.
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={validationErrors.username ? 'input-error' : ''}
                  required
                  placeholder="Enter username (3-50 characters)"
                  maxLength="50"
                />
                {validationErrors.username && (
                  <span className="validation-error">{validationErrors.username}</span>
                )}
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={validationErrors.password ? 'input-error' : ''}
                  required
                  placeholder="Enter password"
                />
                {validationErrors.password && (
                  <span className="validation-error">{validationErrors.password}</span>
                )}
                <div className="password-requirements">
                  <div className={`requirement ${passwordValidation.minLength ? 'met' : ''}`}>
                    {passwordValidation.minLength ? '✓' : '○'} At least 8 characters
                  </div>
                  <div className={`requirement ${passwordValidation.hasUppercase ? 'met' : ''}`}>
                    {passwordValidation.hasUppercase ? '✓' : '○'} One uppercase letter
                  </div>
                  <div className={`requirement ${passwordValidation.hasLowercase ? 'met' : ''}`}>
                    {passwordValidation.hasLowercase ? '✓' : '○'} One lowercase letter
                  </div>
                  <div className={`requirement ${passwordValidation.hasNumber ? 'met' : ''}`}>
                    {passwordValidation.hasNumber ? '✓' : '○'} One number
                  </div>
                  <div className={`requirement ${passwordValidation.hasSpecial ? 'met' : ''}`}>
                    {passwordValidation.hasSpecial ? '✓' : '○'} One special character
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={validationErrors.fullName ? 'input-error' : ''}
                  required
                  placeholder="Enter full name"
                  maxLength="100"
                />
                {validationErrors.fullName && (
                  <span className="validation-error">{validationErrors.fullName}</span>
                )}
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={validationErrors.email ? 'input-error' : ''}
                  required
                  placeholder="Enter email"
                  maxLength="255"
                />
                {validationErrors.email && (
                  <span className="validation-error">{validationErrors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="guest">Guest</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowCreateModal(false);
                  setValidationErrors({});
                  setPasswordValidation({
                    minLength: false,
                    hasUppercase: false,
                    hasLowercase: false,
                    hasNumber: false,
                    hasSpecial: false
                  });
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowResetPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password for {selectedUser.username}</h2>
              <button className="modal-close" onClick={() => setShowResetPasswordModal(false)}>✕</button>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                  placeholder="Enter new password"
                />
                <div className="password-requirements">
                  <div className={`requirement ${passwordValidation.minLength ? 'met' : ''}`}>
                    {passwordValidation.minLength ? '✓' : '○'} At least 8 characters
                  </div>
                  <div className={`requirement ${passwordValidation.hasUppercase ? 'met' : ''}`}>
                    {passwordValidation.hasUppercase ? '✓' : '○'} One uppercase letter
                  </div>
                  <div className={`requirement ${passwordValidation.hasLowercase ? 'met' : ''}`}>
                    {passwordValidation.hasLowercase ? '✓' : '○'} One lowercase letter
                  </div>
                  <div className={`requirement ${passwordValidation.hasNumber ? 'met' : ''}`}>
                    {passwordValidation.hasNumber ? '✓' : '○'} One number
                  </div>
                  <div className={`requirement ${passwordValidation.hasSpecial ? 'met' : ''}`}>
                    {passwordValidation.hasSpecial ? '✓' : '○'} One special character
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => {
                  setShowResetPasswordModal(false);
                  setPasswordValidation({
                    minLength: false,
                    hasUppercase: false,
                    hasLowercase: false,
                    hasNumber: false,
                    hasSpecial: false
                  });
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
