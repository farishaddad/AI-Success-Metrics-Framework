import React from 'react';
import CXMetricCard from './CXMetricCard';
import ResolutionFunnel from './ResolutionFunnel';
import ChurnAnalysis from './ChurnAnalysis';
import CustomerRetentionCohort from './CustomerRetentionCohort';
import FeedbackButton from './FeedbackButton';
import './CustomerExperienceDashboard.css';

const CustomerExperienceDashboard = ({ onFeedbackSubmit }) => {
  const csatData = [
    { value: 4.1 }, { value: 4.2 }, { value: 4.3 }, { value: 4.4 }, { value: 4.5 }, { value: 4.6 }
  ];

  const npsData = [
    { value: 42 }, { value: 45 }, { value: 48 }, { value: 51 }, { value: 54 }, { value: 58 }
  ];

  const resolutionData = [
    { value: 4.5 }, { value: 4.2 }, { value: 3.8 }, { value: 3.5 }, { value: 3.2 }, { value: 2.8 }
  ];

  return (
    <div className="customer-experience-dashboard">
      <div className="cx-metrics-row">
        <CXMetricCard
          title="CSAT Score"
          value="4.6/5.0"
          subtitle="92% Satisfaction"
          trend="up"
          trendValue="+12.2%"
          sparklineData={csatData}
          comparison="vs. pre-AI baseline: 4.1/5.0"
        />
        <CXMetricCard
          title="Net Promoter Score"
          value="58"
          subtitle="Promoters: 68% | Passives: 22% | Detractors: 10%"
          trend="up"
          trendValue="+16 points"
          sparklineData={npsData}
          benchmark="Industry Avg: 45"
        />
        <CXMetricCard
          title="Avg Resolution Time"
          value="2.8 hrs"
          subtitle="168 minutes"
          trend="up"
          trendValue="-38% improvement"
          sparklineData={resolutionData}
          comparison="Target: <3 hours ✓ Achieved"
        />
      </div>

      <ResolutionFunnel />

      <div className="cx-bottom-grid">
        <ChurnAnalysis />
        <CustomerRetentionCohort />
      </div>

      <FeedbackButton 
        pageName="Customer Experience" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default CustomerExperienceDashboard;
