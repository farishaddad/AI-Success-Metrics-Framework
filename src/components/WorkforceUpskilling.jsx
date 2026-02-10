import React from 'react';
import './WorkforceUpskilling.css';

const WorkforceUpskilling = () => {
  const metrics = [
    {
      label: 'Employees Trained in AI Tools',
      current: 78,
      target: 85,
      unit: '%'
    },
    {
      label: 'Teams with AI Capability',
      current: 92,
      target: 95,
      unit: '%'
    },
    {
      label: 'Leaders AI-Literate',
      current: 88,
      target: 90,
      unit: '%'
    },
    {
      label: 'Average AI Proficiency Score',
      current: 7.4,
      target: 8.0,
      unit: '/10',
      isScore: true
    }
  ];

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 95) return '#10b981';
    if (percentage >= 85) return '#3b82f6';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const getProgressPercentage = (current, target, isScore) => {
    if (isScore) {
      return (current / target) * 100;
    }
    return current;
  };

  return (
    <div className="panel workforce-panel">
      <h2 className="panel-title">Workforce Upskilling</h2>
      <div className="upskilling-metrics">
        {metrics.map((metric, index) => {
          const progressPercentage = getProgressPercentage(metric.current, metric.target, metric.isScore);
          const color = getProgressColor(metric.current, metric.target);
          const completionRate = ((metric.current / metric.target) * 100).toFixed(0);
          
          return (
            <div key={index} className="upskilling-metric">
              <div className="metric-header">
                <span className="metric-label">{metric.label}</span>
                <span className="metric-values">
                  <span className="current-value" style={{ color }}>
                    {metric.current}{metric.unit}
                  </span>
                  <span className="target-value">/ {metric.target}{metric.unit}</span>
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progressPercentage}%`,
                      background: color
                    }}
                  >
                    <span className="progress-label">{completionRate}%</span>
                  </div>
                  <div
                    className="target-marker"
                    style={{ left: metric.isScore ? '100%' : `${metric.target}%` }}
                  >
                    <div className="target-line"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="upskilling-summary">
        <div className="summary-card">
          <span className="summary-label">Overall Progress</span>
          <span className="summary-value">89%</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Training Hours</span>
          <span className="summary-value">12,450</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Certifications</span>
          <span className="summary-value">342</span>
        </div>
      </div>
    </div>
  );
};

export default WorkforceUpskilling;
