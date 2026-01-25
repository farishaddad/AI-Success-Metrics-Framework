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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.details.trim()) {
      alert('Please provide details of your suggestion');
      return;
    }

    // Add timestamp for sorting
    const submission = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: Date.now()
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
              className="feedback-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="feedback-form-group">
            <label className="feedback-label">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="feedback-input"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="feedback-form-group">
            <label className="feedback-label">
              Details of Change / Feature Addition <span className="required">*</span>
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="feedback-textarea"
              placeholder="Please describe your suggestion in detail..."
              rows="6"
              required
            />
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
