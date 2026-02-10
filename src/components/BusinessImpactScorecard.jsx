import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './BusinessImpactScorecard.css';

const BusinessImpactScorecard = ({ project }) => {
  const getMetricsForType = (type) => {
    switch (type) {
      case 'customer-facing':
        return [
          { name: 'CSAT Score', current: 4.6, target: 4.2, unit: '/5', trend: [3.8, 4.0, 4.2, 4.4, 4.6], status: 'above' },
          { name: 'NPS', current: 58, target: 50, unit: '', trend: [42, 45, 48, 52, 58], status: 'above' },
          { name: 'Resolution Time', current: 2.8, target: 3.5, unit: 'hrs', trend: [4.5, 4.0, 3.5, 3.0, 2.8], status: 'above' },
          { name: 'First Contact Resolution', current: 78, target: 70, unit: '%', trend: [62, 66, 70, 74, 78], status: 'above' }
        ];
      case 'operational':
        return [
          { name: 'Efficiency Gain', current: 82, target: 75, unit: '%', trend: [45, 55, 65, 75, 82], status: 'above' },
          { name: 'Error Rate', current: 0.9, target: 2.0, unit: '%', trend: [4.2, 3.5, 2.8, 1.5, 0.9], status: 'above' },
          { name: 'Throughput', current: 2250, target: 2000, unit: '/hr', trend: [1200, 1500, 1800, 2000, 2250], status: 'above' },
          { name: 'Processing Time', current: 1.2, target: 2.0, unit: 'sec', trend: [4.5, 3.8, 2.9, 1.8, 1.2], status: 'above' }
        ];
      case 'revenue':
        return [
          { name: 'Conversion Rate', current: 6.7, target: 5.0, unit: '%', trend: [3.7, 4.2, 5.0, 5.8, 6.7], status: 'above' },
          { name: 'Revenue per User', current: 142, target: 120, unit: '$', trend: [95, 105, 115, 128, 142], status: 'above' },
          { name: 'Retention Rate', current: 91, target: 85, unit: '%', trend: [78, 82, 85, 88, 91], status: 'above' },
          { name: 'Upsell Rate', current: 24, target: 20, unit: '%', trend: [12, 15, 18, 21, 24], status: 'above' }
        ];
      default:
        return [];
    }
  };

  const metrics = getMetricsForType(project.type);

  const getStatusColor = (status) => {
    return status === 'above' ? '#10b981' : '#ef4444';
  };

  return (
    <div className="panel business-impact-panel">
      <h2 className="panel-title">Business Impact Scorecard</h2>
      <div className="scorecard-grid">
        {metrics.map((metric, index) => {
          const trendData = metric.trend.map((value, idx) => ({ value, index: idx }));
          const isAboveTarget = metric.name.includes('Time') || metric.name.includes('Error')
            ? metric.current < metric.target
            : metric.current > metric.target;

          return (
            <div key={index} className="scorecard-card">
              <div className="card-header">
                <h3 className="card-metric-name">{metric.name}</h3>
                <div
                  className="card-status-indicator"
                  style={{ background: isAboveTarget ? '#10b981' : '#f59e0b' }}
                >
                  {isAboveTarget ? '✓' : '⚠'}
                </div>
              </div>
              <div className="card-values">
                <div className="card-current">
                  <span className="value-label">Current</span>
                  <span className="value-number" style={{ color: getStatusColor(metric.status) }}>
                    {metric.current}{metric.unit}
                  </span>
                </div>
                <div className="card-target">
                  <span className="value-label">Target</span>
                  <span className="value-number">{metric.target}{metric.unit}</span>
                </div>
              </div>
              <div className="card-trend">
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart data={trendData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={getStatusColor(metric.status)}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessImpactScorecard;
