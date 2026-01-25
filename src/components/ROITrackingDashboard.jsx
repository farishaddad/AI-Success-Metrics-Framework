import React, { useState } from 'react';
import EfficiencyGains from './EfficiencyGains';
import RevenueGeneration from './RevenueGeneration';
import RiskMitigation from './RiskMitigation';
import BusinessAgility from './BusinessAgility';
import FeedbackButton from './FeedbackButton';
import './ROITrackingDashboard.css';

const ROITrackingDashboard = ({ onFeedbackSubmit }) => {
  const [activePillar, setActivePillar] = useState('efficiency');

  return (
    <div className="roi-tracking-dashboard">
      <div className="pillar-tabs">
        <button
          className={`pillar-tab ${activePillar === 'efficiency' ? 'active' : ''}`}
          onClick={() => setActivePillar('efficiency')}
        >
          <span className="tab-icon">⚡</span>
          <span className="tab-label">Efficiency Gains</span>
        </button>
        <button
          className={`pillar-tab ${activePillar === 'revenue' ? 'active' : ''}`}
          onClick={() => setActivePillar('revenue')}
        >
          <span className="tab-icon">💰</span>
          <span className="tab-label">Revenue Generation</span>
        </button>
        <button
          className={`pillar-tab ${activePillar === 'risk' ? 'active' : ''}`}
          onClick={() => setActivePillar('risk')}
        >
          <span className="tab-icon">🛡️</span>
          <span className="tab-label">Risk Mitigation</span>
        </button>
        <button
          className={`pillar-tab ${activePillar === 'agility' ? 'active' : ''}`}
          onClick={() => setActivePillar('agility')}
        >
          <span className="tab-icon">🚀</span>
          <span className="tab-label">Business Agility</span>
        </button>
      </div>
      
      <div className="pillar-content">
        {activePillar === 'efficiency' && <EfficiencyGains />}
        {activePillar === 'revenue' && <RevenueGeneration />}
        {activePillar === 'risk' && <RiskMitigation />}
        {activePillar === 'agility' && <BusinessAgility />}
      </div>

      <FeedbackButton 
        pageName="ROI Tracking" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default ROITrackingDashboard;
