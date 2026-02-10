import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './CXMetricCard.css';

const CXMetricCard = ({ title, value, subtitle, trend, trendValue, sparklineData, comparison, benchmark }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="cx-metric-card">
      <h3 className="cx-card-title">{title}</h3>
      <div className="cx-card-content">
        <div className="cx-primary-value">{value}</div>
        {subtitle && <div className="cx-subtitle">{subtitle}</div>}
        
        {trend && (
          <div className={`cx-trend ${isPositive ? 'positive' : 'negative'}`}>
            <span className="trend-arrow">{isPositive ? '↑' : '↓'}</span>
            <span className="trend-value">{trendValue}</span>
          </div>
        )}
        
        {sparklineData && (
          <div className="cx-sparkline">
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10b981' : '#3b82f6'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {comparison && (
          <div className="cx-comparison">
            {comparison}
          </div>
        )}
        
        {benchmark && (
          <div className="cx-benchmark">
            <span className="benchmark-label">Industry Benchmark:</span>
            <span className="benchmark-value">{benchmark}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CXMetricCard;
