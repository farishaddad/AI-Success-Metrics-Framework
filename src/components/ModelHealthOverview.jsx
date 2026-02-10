import React from 'react';
import './ModelHealthOverview.css';

const ModelHealthOverview = () => {
  const models = [
    { name: 'Customer Sentiment Classifier', status: 'healthy', metric: 'Accuracy: 94.2%', updated: '2 min ago' },
    { name: 'Fraud Detection Model', status: 'healthy', metric: 'F1: 0.91', updated: '5 min ago' },
    { name: 'Product Recommendation Engine', status: 'warning', metric: 'Accuracy: 87.5%', updated: '12 min ago' },
    { name: 'GenAI Content Generator', status: 'healthy', metric: 'Relevance: 96%', updated: '1 min ago' },
    { name: 'Document Classification', status: 'healthy', metric: 'F1: 0.89', updated: '8 min ago' },
    { name: 'Chatbot Response Model', status: 'warning', metric: 'Grounded: 88%', updated: '15 min ago' },
    { name: 'Image Recognition', status: 'healthy', metric: 'Accuracy: 92.8%', updated: '3 min ago' },
    { name: 'Anomaly Detection', status: 'critical', metric: 'Precision: 76%', updated: '45 min ago' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return '✓';
      case 'warning':
        return '⚠';
      case 'critical':
        return '✕';
      default:
        return '?';
    }
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  return (
    <div className="model-health-banner">
      <h2 className="banner-title">Model Health Overview</h2>
      <div className="model-grid">
        {models.map((model, index) => (
          <div key={index} className={`model-card ${getStatusClass(model.status)}`}>
            <div className="model-header">
              <span className="model-name">{model.name}</span>
              <span className={`status-icon ${getStatusClass(model.status)}`}>
                {getStatusIcon(model.status)}
              </span>
            </div>
            <div className="model-metric">{model.metric}</div>
            <div className="model-updated">Updated: {model.updated}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelHealthOverview;
