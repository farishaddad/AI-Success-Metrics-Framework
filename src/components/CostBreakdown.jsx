import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './CostBreakdown.css';

const CostBreakdown = () => {
  const data = [
    { category: 'Infrastructure', compute: 850, storage: 320, network: 180, total: 1350, color: '#3b82f6' },
    { category: 'Licensing', apis: 620, tools: 380, total: 1000, color: '#8b5cf6' },
    { category: 'Personnel', scientists: 720, engineers: 680, devops: 420, total: 1820, color: '#10b981' },
    { category: 'Training', training: 280, certs: 150, total: 430, color: '#f59e0b' },
    { category: 'Maintenance', ops: 340, support: 220, total: 560, color: '#ef4444' }
  ];

  const totalCost = data.reduce((sum, item) => sum + item.total, 0);

  const CustomTooltip = ({ active, payload }) => {
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
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>{data.category}</p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>
            Total: ${data.total}K
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            {((data.total / totalCost) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel cost-breakdown-panel">
      <h2 className="panel-title">Cost Breakdown</h2>
      <div className="cost-summary">
        <div className="cost-total">
          <span className="cost-label">Total Cost</span>
          <span className="cost-value">${(totalCost / 1000).toFixed(2)}M</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis label={{ value: 'Cost ($K)', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="cost-legend">
        <div className="legend-group">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#3b82f6' }}></div>
            <span>Infrastructure ($1.35M)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#8b5cf6' }}></div>
            <span>Licensing ($1.0M)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#10b981' }}></div>
            <span>Personnel ($1.82M)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f59e0b' }}></div>
            <span>Training ($430K)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#ef4444' }}></div>
            <span>Maintenance ($560K)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
