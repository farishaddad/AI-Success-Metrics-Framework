import React, { useState, useEffect } from 'react';
import './FeedbackList.css';

const FeedbackList = ({ feedbackItems }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Debug: Log when feedbackItems changes
  useEffect(() => {
    console.log('FeedbackList received items:', feedbackItems);
  }, [feedbackItems]);

  // Get unique page names for filter
  const pageNames = ['all', ...new Set(feedbackItems.map(item => item.pageName))];

  // Filter and search
  const filteredItems = feedbackItems.filter(item => {
    const matchesFilter = filter === 'all' || item.pageName === filter;
    const matchesSearch = 
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.pageName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort by date (newest first)
  const sortedItems = [...filteredItems].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="feedback-list-container">
      <div className="feedback-list-header">
        <div className="feedback-list-title">
          <h2>💡 User Suggestions</h2>
          <span className="feedback-count">{sortedItems.length} {sortedItems.length === 1 ? 'suggestion' : 'suggestions'}</span>
        </div>

        <div className="feedback-list-controls">
          <div className="feedback-search">
            <input
              type="text"
              placeholder="Search suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="feedback-search-input"
            />
          </div>

          <div className="feedback-filter">
            <label>Filter by page:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="feedback-filter-select"
            >
              {pageNames.map(page => (
                <option key={page} value={page}>
                  {page === 'all' ? 'All Pages' : page}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <div className="feedback-empty">
          <div className="feedback-empty-icon">📭</div>
          <p>No suggestions found</p>
          <span>Try adjusting your search or filter</span>
        </div>
      ) : (
        <div className="feedback-list-items">
          {sortedItems.map((item) => (
            <div key={item.id} className="feedback-item">
              <div className="feedback-item-header">
                <div className="feedback-item-meta">
                  <span className="feedback-item-page">{item.pageName}</span>
                  <span className="feedback-item-date">{formatDate(item.timestamp)}</span>
                </div>
                {item.name && (
                  <div className="feedback-item-author">
                    <span className="feedback-author-icon">👤</span>
                    <span className="feedback-author-name">{item.name}</span>
                    {item.email && (
                      <span className="feedback-author-email">{item.email}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="feedback-item-content">
                <p>{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
