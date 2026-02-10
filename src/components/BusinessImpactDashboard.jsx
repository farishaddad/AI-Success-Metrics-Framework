import React from 'react';
import KPICard from './KPICard';
import RevenueAttribution from './RevenueAttribution';
import TimeToMarketComparison from './TimeToMarketComparison';
import FeedbackButton from './FeedbackButton';
import './BusinessImpactDashboard.css';

const BusinessImpactDashboard = ({ onFeedbackSubmit }) => {
  const kpiData = [
    {
      title: 'Revenue Growth',
      value: '+$4.2M',
      subtitle: 'AI-Attributed Revenue',
      comparison: '+18% vs. previous period',
      icon: 'trend',
      positive: true
    },
    {
      title: 'Market Share',
      value: '3.7%',
      subtitle: 'Market Share Gain',
      comparison: '+1.2% vs. baseline',
      icon: 'pie',
      positive: true
    },
    {
      title: 'Time-to-Market',
      value: '-45 days',
      subtitle: 'Faster Product Launch',
      comparison: '-32% vs. traditional',
      icon: 'clock',
      positive: true
    },
    {
      title: 'Innovation Index',
      value: '24',
      subtitle: 'New Patents/Models Filed',
      comparison: '+67% YoY growth',
      icon: 'lightbulb',
      positive: true
    }
  ];

  return (
    <div className="business-impact-dashboard">
      <div className="kpi-row">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
      
      <div className="chart-section">
        <RevenueAttribution />
      </div>
      
      <div className="chart-section">
        <TimeToMarketComparison />
      </div>

      <FeedbackButton 
        pageName="Business Impact" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default BusinessImpactDashboard;
