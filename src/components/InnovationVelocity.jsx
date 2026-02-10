import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './Panel.css';

const InnovationVelocity = () => {
  const data = [
    { quarter: 'Q1 2024', features: 8, cumulative: 8, target: 10, status: 'behind' },
    { quarter: 'Q2 2024', features: 12, cumulative: 20, target: 10, status: 'ontrack' },
    { quarter: 'Q3 2024', features: 15, cumulative: 35, target: 10, status: 'ontrack' },
    { quarter: 'Q4 2024', features: 11, cumulative: 46, target: 10, status: 'ontrack' },
    { quarter: 'Q1 2025', features: 14, cumulative: 60, target: 10, status: 'ontrack' },
    { quarter: 'Q2 2025', features: 13, cumulative: 73, target: 10, status: 'ontrack' }
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
          <p style={{ fontSize: '13px' }}>Features Released: {data.features}</p>
          <p style={{ fontSize: '13px' }}>Cumulative: {data.cumulative}</p>
          <p style={{ fontSize: '13px' }}>Target: {data.target}</p>
          <p style={{ 
            fontSize: '13px', 
            fontWeight: 600, 
            marginTop: '4px',
            color: data.status === 'ontrack' ? '#10b981' : '#ef4444'
          }}>
            Status: {data.status === 'ontrack' ? 'On Track ✓' : 'Behind Schedule'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel innovation-velocity-panel">
      <h2 className="panel-title">Innovation Velocity</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Total Features</span>
          <span className="summary-value">73</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Avg per Quarter</span>
          <span className="summary-value">12.2</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">vs Target</span>
          <span className="summary-value positive">+22%</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="quarter" />
            <YAxis yAxisId="left" label={{ value: 'Features Released', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Cumulative', angle: 90, position: 'insideRight' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine
              yAxisId="left"
              y={10}
              stroke="#667eea"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'Target: 10/quarter', position: 'right', fill: '#667eea', fontWeight: 600 }}
            />
            <Bar yAxisId="left" dataKey="features" name="Features Released" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <rect key={`bar-${index}`} fill={entry.status === 'ontrack' ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6' }}
              name="Cumulative Features"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InnovationVelocity;
