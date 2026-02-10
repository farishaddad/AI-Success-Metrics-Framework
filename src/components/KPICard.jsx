import React from 'react';
import './KPICard.css';

const KPICard = ({ title, value, subtitle, comparison, icon, positive }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'trend':
        return (
          <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="17 6 23 6 23 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pie':
        return (
          <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 12A10 10 0 0 0 12 2v10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'clock':
        return (
          <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'lightbulb':
        return (
          <svg className="kpi-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 22h4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        <div className={`kpi-icon-container ${positive ? 'positive' : 'negative'}`}>
          {renderIcon()}
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-subtitle">{subtitle}</div>
      <div className={`kpi-comparison ${positive ? 'positive' : 'negative'}`}>
        {comparison}
      </div>
    </div>
  );
};

export default KPICard;
