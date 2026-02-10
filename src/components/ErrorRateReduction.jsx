import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import './Panel.css';

const ErrorRateReduction = () => {
  const data = [
    { month: 'Jan', baseline: 4.2, current: 4.2 },
    { month: 'Feb', baseline: 4.2, current: 3.8 },
    { month: 'Mar', baseline: 4.2, current: 3.2 },
    { month: 'Apr', baseline: 4.2, current: 2.6 },
    { month: 'May', baseline: 4.2, current: 2.1 },
    { month: 'Jun', baseline: 4.2, current: 1.7 },
    { month: 'Jul', baseline: 4.2, current: 1.3 },
    { month: 'Aug', baseline: 4.2, current: 0.9 }
  ];

  const reduction = Math.round((1 - 0.9 / 4.2) * 100);

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
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>{data.month}</p>
          <p style={{ color: '#ef4444', fontSize: '13px' }}>Baseline: {data.baseline}%</p>
          <p style={{ color: '#10b981', fontSize: '13px' }}>Current: {data.current}%</p>
          <p style={{ color: '#3b82f6', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
            Reduction: {(data.baseline - data.current).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Error Rate Reduction</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Current Error Rate</span>
          <span className="summary-value">0.9%</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Reduction</span>
          <span className="summary-value positive">-{reduction}%</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorBaseline)"
              name="Baseline"
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#colorCurrent)"
              name="Current"
            />
            <ReferenceLine
              y={0.9}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: `${reduction}% Reduction`, position: 'top', fill: '#10b981', fontWeight: 600 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ErrorRateReduction;
