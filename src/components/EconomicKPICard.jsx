import React from 'react';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import './EconomicKPICard.css';

const EconomicKPICard = ({ title, value, subtitle, formula, trend, trendData, benchmark, comparison, histogram, target }) => {
  return (
    <div className="economic-kpi-card">
      <h3 className="economic-card-title">{title}</h3>
      <div className="economic-card-content">
        <div className="economic-primary-value">{value}</div>
        
        {subtitle && <div className="economic-subtitle">{subtitle}</div>}
        
        {formula && (
          <div className="economic-formula">
            <span className="formula-label">Formula:</span>
            <span className="formula-text">{formula}</span>
          </div>
        )}
        
        {trend && trendData && (
          <div className="economic-trend-section">
            <div className="trend-label">{trend}</div>
            <div className="economic-sparkline">
              <ResponsiveContainer width="100%" height={50}>
                <LineChart data={trendData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {histogram && (
          <div className="economic-histogram">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={histogram}>
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {target && (
              <div className="histogram-target">Target: {target}</div>
            )}
          </div>
        )}
        
        {benchmark && (
          <div className="economic-benchmark">
            <span className="benchmark-label">Industry Avg:</span>
            <span className="benchmark-value">{benchmark}</span>
          </div>
        )}
        
        {comparison && (
          <div className="economic-comparison">
            {comparison}
          </div>
        )}
      </div>
    </div>
  );
};

export default EconomicKPICard;
