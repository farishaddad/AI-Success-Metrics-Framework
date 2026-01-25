import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import './Panel.css';

const MarketAdaptationSpeed = () => {
  const data = [
    {
      opportunity: 'New Competitor Entry',
      detection: 2,
      analysis: 3,
      implementation: 8,
      totalWithAI: 13,
      totalWithoutAI: 45
    },
    {
      opportunity: 'Customer Demand Shift',
      detection: 1,
      analysis: 2,
      implementation: 6,
      totalWithAI: 9,
      totalWithoutAI: 38
    },
    {
      opportunity: 'Regulatory Change',
      detection: 3,
      analysis: 4,
      implementation: 10,
      totalWithAI: 17,
      totalWithoutAI: 52
    },
    {
      opportunity: 'Tech Innovation',
      detection: 1,
      analysis: 2,
      implementation: 5,
      totalWithAI: 8,
      totalWithoutAI: 35
    },
    {
      opportunity: 'Market Disruption',
      detection: 2,
      analysis: 3,
      implementation: 7,
      totalWithAI: 12,
      totalWithoutAI: 42
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>{label}</p>
          <p style={{ fontSize: '13px', color: '#3b82f6' }}>Detection: {data.detection} days</p>
          <p style={{ fontSize: '13px', color: '#8b5cf6' }}>Analysis: {data.analysis} days</p>
          <p style={{ fontSize: '13px', color: '#10b981' }}>Implementation: {data.implementation} days</p>
          <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '8px', color: '#1f2937' }}>
            With AI: {data.totalWithAI} days
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>
            Without AI: {data.totalWithoutAI} days
          </p>
          <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#10b981' }}>
            Improvement: {Math.round((1 - data.totalWithAI / data.totalWithoutAI) * 100)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel market-adaptation-panel">
      <h2 className="panel-title">Market Adaptation Speed</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Avg Response Time</span>
          <span className="summary-value">11.8 days</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">vs Without AI</span>
          <span className="summary-value positive">-72%</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="opportunity"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis label={{ value: 'Days to Response', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <ReferenceLine
              y={20}
              stroke="#667eea"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'Target: 20 days', position: 'right', fill: '#667eea', fontWeight: 600 }}
            />
            <Bar dataKey="detection" stackId="a" fill="#3b82f6" name="Detection Time" />
            <Bar dataKey="analysis" stackId="a" fill="#8b5cf6" name="Analysis Time" />
            <Bar dataKey="implementation" stackId="a" fill="#10b981" name="Implementation Time" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketAdaptationSpeed;
