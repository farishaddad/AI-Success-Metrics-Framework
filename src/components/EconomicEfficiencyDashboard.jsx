import React from 'react';
import EconomicKPICard from './EconomicKPICard';
import ROIByPillars from './ROIByPillars';
import CostBreakdown from './CostBreakdown';
import PaybackTimeline from './PaybackTimeline';
import FeedbackButton from './FeedbackButton';
import './EconomicEfficiencyDashboard.css';

const EconomicEfficiencyDashboard = ({ onFeedbackSubmit }) => {
  try {
  const roiTrendData = [
    { value: 85 }, { value: 92 }, { value: 98 }, { value: 105 },
    { value: 112 }, { value: 118 }, { value: 123 }, { value: 127 },
    { value: 132 }, { value: 138 }, { value: 142 }, { value: 147 }
  ];

  const tcoTrendData = [
    { value: 2.8 }, { value: 2.7 }, { value: 2.6 }, { value: 2.5 },
    { value: 2.5 }, { value: 2.4 }, { value: 2.4 }, { value: 2.3 },
    { value: 2.3 }, { value: 2.2 }, { value: 2.2 }, { value: 2.1 }
  ];

  const paybackHistogram = [
    { range: '0-3', count: 2 },
    { range: '3-6', count: 5 },
    { range: '6-9', count: 8 },
    { range: '9-12', count: 6 },
    { range: '12+', count: 3 }
  ];

  const lcoaiTrendData = [
    { value: 0.045 }, { value: 0.042 }, { value: 0.039 }, { value: 0.037 },
    { value: 0.035 }, { value: 0.033 }, { value: 0.031 }, { value: 0.029 },
    { value: 0.028 }, { value: 0.027 }, { value: 0.026 }, { value: 0.025 }
  ];

  return (
    <div className="economic-efficiency-dashboard">
      <div className="economic-kpi-row">
        <EconomicKPICard
          title="Overall ROI"
          value="147%"
          formula="(Net Gains / Total Investment) × 100"
          trend="12-Month Rolling ROI"
          trendData={roiTrendData}
          benchmark="Industry Avg: 95%"
        />
        <EconomicKPICard
          title="Total Cost of Ownership"
          value="$2.1M"
          subtitle="Annual TCO"
          trend="Monthly TCO Trend"
          trendData={tcoTrendData}
          comparison="Budget: $2.5M | Actual: $2.1M (16% under budget)"
        />
        <EconomicKPICard
          title="Average Payback Period"
          value="7.2 months"
          subtitle="Median: 6.8 months"
          histogram={paybackHistogram}
          target="Target: <9 months"
        />
        <EconomicKPICard
          title="LCOAI"
          value="$0.025"
          subtitle="Per inference"
          trend="Cost Optimization Trend"
          trendData={lcoaiTrendData}
          comparison="API: $0.035 | Self-hosted: $0.025 (29% savings)"
        />
      </div>

      <ROIByPillars />

      <div className="economic-bottom-grid">
        <CostBreakdown />
        <PaybackTimeline />
      </div>

      <FeedbackButton 
        pageName="Economic Efficiency" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
  } catch (error) {
    console.error('Error in EconomicEfficiencyDashboard:', error);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Error loading Economic Efficiency Dashboard</h2>
        <p>{error.message}</p>
        <FeedbackButton 
          pageName="Economic Efficiency" 
          onFeedbackSubmit={onFeedbackSubmit}
        />
      </div>
    );
  }
};

export default EconomicEfficiencyDashboard;
