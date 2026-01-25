import React from 'react';
import InnovationVelocity from './InnovationVelocity';
import WorkforceUpskilling from './WorkforceUpskilling';
import MarketAdaptationSpeed from './MarketAdaptationSpeed';
import InnovationPipeline from './InnovationPipeline';
import FeedbackButton from './FeedbackButton';
import './InnovationCapacityDashboard.css';

const InnovationCapacityDashboard = ({ onFeedbackSubmit }) => {
  return (
    <div className="innovation-capacity-dashboard">
      <InnovationVelocity />
      
      <div className="innovation-middle-grid">
        <WorkforceUpskilling />
        <MarketAdaptationSpeed />
      </div>
      
      <InnovationPipeline />

      <FeedbackButton 
        pageName="Innovation Capacity" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default InnovationCapacityDashboard;
