import React, { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ onClose, pageName, onSubmit }) => {
  const [formData, setFormData] = useState({
    pageName: pageName,
    date: new Date().toISOString().split('T')[0],
    name: '',
    email: '',
    details: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Details validation (required)
    if (!formData.details.trim()) {
      errors.details = 'Details are required';
    } else if (formData.details.trim().length < 10) {
      errors.details = 'Details must be at least 10 characters';
    } else if (formData.details.length > 2000) {
      errors.details = 'Details must be less than 2000 characters';
    }

    // Name validation (optional, but if provided must be valid)
    if (formData.name.trim()) {
      if (formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      } else if (formData.name.length > 100) {
        errors.name = 'Name must be less than 100 characters';
      } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
        errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
      }
    }

    // Email validation (optional, but if provided must be valid)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      } else if (formData.email.length > 255) {
        errors.email = 'Email must be less than 255 characters';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field as user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Add timestamp for sorting (don't include id - database will generate it)
    const submission = {
      ...formData,
      timestamp: new Date().toISOString()
    };

    onSubmit(submission);
    onClose();
  };

  return (
    <div className="feedback-overlay" onClick={onClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-header">
          <h2>💡 Suggest Changes or Additions</h2>
          <button className="feedback-close" onClick={onClose}>✕</button>
        </div>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="feedback-form-row">
            <div className="feedback-form-group">
              <label className="feedback-label">Page Name</label>
              <input
                type="text"
                name="pageName"
                value={formData.pageName}
                className="feedback-input"
                readOnly
                disabled
              />
            </div>
            
            <div className="feedback-form-group">
              <label className="feedback-label">Date</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                className="feedback-input"
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="feedback-form-group">
            <label className="feedback-label">Your Name (Optional)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`feedback-input ${validationErrors.name ? 'input-error' : ''}`}
              placeholder="Enter your name"
              maxLength="100"
            />
            {validationErrors.name && (
              <span className="validation-error">{validationErrors.name}</span>
            )}
          </div>

          <div className="feedback-form-group">
            <label className="feedback-label">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`feedback-input ${validationErrors.email ? 'input-error' : ''}`}
              placeholder="your.email@example.com"
              maxLength="255"
            />
            {validationErrors.email && (
              <span className="validation-error">{validationErrors.email}</span>
            )}
          </div>

          <div className="feedback-form-group">
            <label className="feedback-label">
              Details of Change / Feature Addition <span className="required">*</span>
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className={`feedback-textarea ${validationErrors.details ? 'input-error' : ''}`}
              placeholder="Please describe your suggestion in detail (minimum 10 characters)..."
              rows="6"
              maxLength="2000"
              required
            />
            {validationErrors.details && (
              <span className="validation-error">{validationErrors.details}</span>
            )}
            <div className="character-count">
              {formData.details.length} / 2000 characters
            </div>
          </div>

          <div className="feedback-actions">
            <button type="button" className="feedback-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="feedback-btn-submit">
              Submit Suggestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
