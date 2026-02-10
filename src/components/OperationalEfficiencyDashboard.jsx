import React from 'react';
import ProcessCycleTime from './ProcessCycleTime';
import ErrorRateReduction from './ErrorRateReduction';
import ProductivityGains from './ProductivityGains';
import CostPerTransaction from './CostPerTransaction';
import TaskLevelROI from './TaskLevelROI';
import FeedbackButton from './FeedbackButton';
import './OperationalEfficiencyDashboard.css';

const OperationalEfficiencyDashboard = ({ onFeedbackSubmit }) => {
  return (
    <div className="operational-efficiency-dashboard">
      <div className="efficiency-grid">
        <ProcessCycleTime />
        <ErrorRateReduction />
        <ProductivityGains />
        <CostPerTransaction />
      </div>
      
      <div className="table-section">
        <TaskLevelROI />
      </div>

      <FeedbackButton 
        pageName="Operational Efficiency" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default OperationalEfficiencyDashboard;
