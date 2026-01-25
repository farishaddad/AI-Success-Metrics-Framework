import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Panel.css';

const CostPerTransaction = () => {
  const data = [
    { month: 'Jan', volume: 12500, cost: 4.80 },
    { month: 'Feb', volume: 13200, cost: 4.50 },
    { month: 'Mar', volume: 14100, cost: 4.10 },
    { month: 'Apr', volume: 15800, cost: 3.70 },
    { month: 'May', volume: 17200, cost: 3.30 },
    { month: 'Jun', volume: 18900, cost: 2.95 },
    { month: 'Jul', volume: 20500, cost: 2.60 },
    { month: 'Aug', volume: 22100, cost: 2.30 }
  ];

  const totalSavings = data.reduce((sum, item, index) => {
    if (index === 0) return 0;
    const savings = (data[0].cost - item.cost) * item.volume;
    return sum + savings;
  }, 0);

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
          <p style={{ color: '#3b82f6', fontSize: '13px' }}>Volume: {data.volume.toLocaleString()}</p>
          <p style={{ color: '#10b981', fontSize: '13px' }}>Cost/Transaction: ${data.cost.toFixed(2)}</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            Total Cost: ${(data.volume * data.cost).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Cost per Transaction</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Current Cost</span>
          <span className="summary-value">$2.30</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Total Savings</span>
          <span className="summary-value positive">${(totalSavings / 1000).toFixed(0)}K</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Volume', angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Cost ($)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="volume"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name="Transaction Volume"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cost"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: '#10b981' }}
              name="Cost per Transaction"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostPerTransaction;
