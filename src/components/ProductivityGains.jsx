import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import './Panel.css';

const ProductivityGains = () => {
  const targetIndex = 125;
  
  const data = [
    { team: 'Engineering', index: 142, target: targetIndex },
    { team: 'Operations', index: 135, target: targetIndex },
    { team: 'Customer Service', index: 128, target: targetIndex },
    { team: 'Sales', index: 118, target: targetIndex },
    { team: 'Marketing', index: 122, target: targetIndex },
    { team: 'Finance', index: 115, target: targetIndex }
  ];

  const getBarColor = (value, target) => {
    if (value >= target) return '#10b981';
    if (value >= target * 0.9) return '#f59e0b';
    return '#ef4444';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const vsTarget = data.index - data.target;
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>{data.team}</p>
          <p style={{ fontSize: '13px' }}>Productivity Index: {data.index}</p>
          <p style={{ fontSize: '13px' }}>Target: {data.target}</p>
          <p style={{ 
            fontSize: '13px', 
            fontWeight: 600, 
            marginTop: '4px',
            color: vsTarget >= 0 ? '#10b981' : '#ef4444'
          }}>
            {vsTarget >= 0 ? '+' : ''}{vsTarget} vs Target
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Productivity Gains</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Average Index</span>
          <span className="summary-value">127</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">vs Baseline (100)</span>
          <span className="summary-value positive">+27%</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="team"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis label={{ value: 'Productivity Index', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={targetIndex}
              stroke="#667eea"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: `Target: ${targetIndex}`, position: 'right', fill: '#667eea', fontWeight: 600 }}
            />
            <Bar dataKey="index" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.index, entry.target)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityGains;
