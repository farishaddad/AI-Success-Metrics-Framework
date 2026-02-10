import React from 'react';
import HealthScoreBanner from './HealthScoreBanner';
import ROIPanel from './ROIPanel';
import CostSavingsPanel from './CostSavingsPanel';
import ProjectPortfolioPanel from './ProjectPortfolioPanel';
import StrategicAlignmentPanel from './StrategicAlignmentPanel';
import FeedbackButton from './FeedbackButton';
import './Dashboard.css';

const Dashboard = ({ onFeedbackSubmit }) => {
  return (
    <div className="dashboard">
      <HealthScoreBanner score={85} />
      
      <div className="dashboard-grid">
        <ROIPanel />
        <CostSavingsPanel />
        <ProjectPortfolioPanel />
        <StrategicAlignmentPanel />
      </div>

      <FeedbackButton 
        pageName="Executive Overview" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default Dashboard;
