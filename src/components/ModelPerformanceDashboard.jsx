import React from 'react';
import ModelHealthOverview from './ModelHealthOverview';
import ClassificationMetrics from './ClassificationMetrics';
import GenAIMetrics from './GenAIMetrics';
import PerformanceUnderLoad from './PerformanceUnderLoad';
import FairnessBiasMetrics from './FairnessBiasMetrics';
import FeedbackButton from './FeedbackButton';
import './ModelPerformanceDashboard.css';

const ModelPerformanceDashboard = ({ onFeedbackSubmit }) => {
  return (
    <div className="model-performance-dashboard">
      <ModelHealthOverview />
      
      <div className="performance-grid">
        <ClassificationMetrics />
        <PerformanceUnderLoad />
      </div>
      
      <GenAIMetrics />
      
      <FairnessBiasMetrics />

      <FeedbackButton 
        pageName="Model Performance" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default ModelPerformanceDashboard;
