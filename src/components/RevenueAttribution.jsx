import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import './RevenueAttribution.css';

const RevenueAttribution = () => {
  const data = [
    { name: 'Baseline Revenue', value: 12.5, color: '#9ca3af', isBaseline: true },
    { name: 'New AI Products', value: 2.8, color: '#3b82f6', isBaseline: false },
    { name: 'Cross-sell Improvements', value: 1.2, color: '#8b5cf6', isBaseline: false },
    { name: 'Up-sell Conversions', value: 1.5, color: '#10b981', isBaseline: false },
    { name: 'Retention Improvements', value: 0.9, color: '#f59e0b', isBaseline: false },
    { name: 'Total AI Revenue', value: 18.9, color: '#667eea', isBaseline: true }
  ];

  const formatValue = (value) => `$${value.toFixed(1)}M`;

  const CustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 8}
        fill="#1f2937"
        textAnchor="middle"
        fontSize="12"
        fontWeight="600"
      >
        {formatValue(value)}
      </text>
    );
  };

  return (
    <div className="revenue-attribution panel">
      <h2 className="panel-title">Revenue Attribution</h2>
      <div className="revenue-summary">
        <div className="revenue-stat">
          <span className="stat-label">Baseline</span>
          <span className="stat-value">$12.5M</span>
        </div>
        <div className="revenue-arrow">→</div>
        <div className="revenue-stat highlight">
          <span className="stat-label">Total AI-Attributed</span>
          <span className="stat-value">$18.9M</span>
        </div>
        <div className="revenue-growth">
          <span className="growth-badge">+51% Growth</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 30, right: 20, bottom: 80, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={(value) => `$${value}M`} />
            <Tooltip formatter={(value) => formatValue(value)} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              <LabelList content={<CustomLabel />} />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueAttribution;
