import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './Panel.css';

const ROIPanel = () => {
  const sparklineData = [
    { value: 85 }, { value: 92 }, { value: 88 }, { value: 105 },
    { value: 110 }, { value: 115 }, { value: 118 }, { value: 122 },
    { value: 120 }, { value: 125 }, { value: 123 }, { value: 127 }
  ];

  const roi = 127;
  const isPositive = roi > 0;

  return (
    <div className="panel">
      <h2 className="panel-title">Overall AI ROI</h2>
      <div className="roi-content">
        <div className={`roi-primary ${isPositive ? 'positive' : 'negative'}`}>
          {roi}%
        </div>
        <div className="roi-sparkline">
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="roi-metrics">
          <div className="roi-metric">
            <span className="metric-label">Total Investment</span>
            <span className="metric-value">$2.4M</span>
          </div>
          <div className="roi-metric">
            <span className="metric-label">Net Gains</span>
            <span className="metric-value">$5.5M</span>
          </div>
          <div className="roi-metric">
            <span className="metric-label">Payback Period</span>
            <span className="metric-value">8 months</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIPanel;
