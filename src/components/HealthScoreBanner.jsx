import React from 'react';
import './HealthScoreBanner.css';

const HealthScoreBanner = ({ score }) => {
  const getColor = (score) => {
    if (score >= 81) return '#10b981';
    if (score >= 61) return '#f59e0b';
    return '#ef4444';
  };

  const getStatus = (score) => {
    if (score >= 81) return 'Excellent';
    if (score >= 61) return 'Good';
    return 'Needs Attention';
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="health-score-banner">
      <div className="banner-content">
        <h1 className="banner-title">AI Program Health Score</h1>
        <div className="gauge-container">
          <svg className="gauge-svg" viewBox="0 0 160 160">
            <circle
              className="gauge-background"
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              className="gauge-progress"
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke={getColor(score)}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="gauge-text">
            <div className="gauge-score" style={{ color: getColor(score) }}>
              {score}
            </div>
            <div className="gauge-status">{getStatus(score)}</div>
          </div>
        </div>
        <div className="score-scale">
          <div className="scale-item">
            <div className="scale-color" style={{ background: '#ef4444' }}></div>
            <span>0-60</span>
          </div>
          <div className="scale-item">
            <div className="scale-color" style={{ background: '#f59e0b' }}></div>
            <span>61-80</span>
          </div>
          <div className="scale-item">
            <div className="scale-color" style={{ background: '#10b981' }}></div>
            <span>81-100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreBanner;
