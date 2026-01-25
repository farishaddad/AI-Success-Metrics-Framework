import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './Panel.css';

const CostSavingsPanel = () => {
  const data = [
    { name: 'Efficiency Gains', value: 1850000, color: '#3b82f6' },
    { name: 'Risk Mitigation', value: 1200000, color: '#8b5cf6' },
    { name: 'Operational Savings', value: 980000, color: '#10b981' },
    { name: 'Resource Optimization', value: 750000, color: '#f59e0b' }
  ];

  const totalSavings = data.reduce((sum, item) => sum + item.value, 0);

  const formatValue = (value) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Cost Savings Summary</h2>
      <div className="total-savings">{formatValue(totalSavings)}</div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip formatter={(value) => formatValue(value)} />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
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

export default CostSavingsPanel;
