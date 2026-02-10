import React from 'react';
import './InnovationPipeline.css';

const InnovationPipeline = () => {
  const pipeline = {
    ideation: [
      { name: 'AI-Powered Analytics', priority: 'high', investment: 150 },
      { name: 'Voice Assistant Integration', priority: 'medium', investment: 200 },
      { name: 'Predictive Maintenance', priority: 'high', investment: 180 },
      { name: 'Smart Recommendations', priority: 'low', investment: 120 }
    ],
    poc: [
      { name: 'Document Intelligence', priority: 'high', investment: 250 },
      { name: 'Automated Testing Suite', priority: 'medium', investment: 180 },
      { name: 'Customer Sentiment Analysis', priority: 'high', investment: 220 }
    ],
    pilot: [
      { name: 'AI Code Review Assistant', priority: 'high', investment: 320 },
      { name: 'Dynamic Pricing Engine', priority: 'medium', investment: 280 },
      { name: 'Fraud Detection v2', priority: 'high', investment: 350 }
    ],
    production: [
      { name: 'Chatbot Platform', priority: 'high', investment: 450 },
      { name: 'Content Moderation', priority: 'medium', investment: 380 }
    ],
    scaled: [
      { name: 'Personalization Engine', priority: 'high', investment: 650 },
      { name: 'Supply Chain Optimizer', priority: 'high', investment: 580 }
    ]
  };

  const stages = [
    { key: 'ideation', label: 'Ideation', color: '#e0e7ff' },
    { key: 'poc', label: 'Proof of Concept', color: '#dbeafe' },
    { key: 'pilot', label: 'Pilot', color: '#fef3c7' },
    { key: 'production', label: 'Production', color: '#d1fae5' },
    { key: 'scaled', label: 'Scaled', color: '#c7d2fe' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getStageTotal = (items) => {
    return items.reduce((sum, item) => sum + item.investment, 0);
  };

  return (
    <div className="panel innovation-pipeline-panel">
      <h2 className="panel-title">Innovation Pipeline</h2>
      <div className="pipeline-summary">
        <div className="summary-stat">
          <span className="summary-label">Total Initiatives</span>
          <span className="summary-value">16</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Total Investment</span>
          <span className="summary-value">$4.91M</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">High Priority</span>
          <span className="summary-value">10</span>
        </div>
      </div>
      <div className="kanban-board">
        {stages.map((stage) => {
          const items = pipeline[stage.key];
          const total = getStageTotal(items);
          return (
            <div key={stage.key} className="kanban-column">
              <div className="column-header" style={{ background: stage.color }}>
                <h3 className="column-title">{stage.label}</h3>
                <div className="column-stats">
                  <span className="column-count">{items.length} items</span>
                  <span className="column-investment">${(total / 1000).toFixed(1)}K</span>
                </div>
              </div>
              <div className="column-content">
                {items.map((item, index) => (
                  <div key={index} className="kanban-card">
                    <div className="card-header">
                      <span className="card-name">{item.name}</span>
                      <span
                        className="priority-badge"
                        style={{ background: getPriorityColor(item.priority) }}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <div className="card-footer">
                      <span className="card-investment">${item.investment}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InnovationPipeline;
