import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import './TimeToMarketComparison.css';

const TimeToMarketComparison = () => {
  const data = [
    {
      category: 'Mobile App',
      traditional: 180,
      aiEnabled: 95,
      improvement: 47
    },
    {
      category: 'Web Platform',
      traditional: 150,
      aiEnabled: 85,
      improvement: 43
    },
    {
      category: 'API Service',
      traditional: 90,
      aiEnabled: 45,
      improvement: 50
    },
    {
      category: 'ML Model',
      traditional: 120,
      aiEnabled: 60,
      improvement: 50
    },
    {
      category: 'Data Pipeline',
      traditional: 75,
      aiEnabled: 35,
      improvement: 53
    }
  ];

  const CustomLabel = (props) => {
    const { x, y, width, height, value, dataKey } = props;
    if (dataKey === 'aiEnabled') {
      const index = data.findIndex(d => d.aiEnabled === value);
      const improvement = data[index]?.improvement;
      return (
        <text
          x={x + width + 8}
          y={y + height / 2}
          fill="#10b981"
          textAnchor="start"
          fontSize="12"
          fontWeight="700"
          dominantBaseline="middle"
        >
          -{improvement}%
        </text>
      );
    }
    return null;
  };

  return (
    <div className="time-to-market panel">
      <h2 className="panel-title">Time-to-Market Comparison</h2>
      <div className="ttm-summary">
        <div className="ttm-stat">
          <span className="ttm-label">Average Reduction</span>
          <span className="ttm-value">-49%</span>
        </div>
        <div className="ttm-stat">
          <span className="ttm-label">Days Saved (Avg)</span>
          <span className="ttm-value">56 days</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 80, bottom: 60, left: 20 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Days to Market', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name) => [
                `${value} days`,
                name === 'traditional' ? 'Traditional Process' : 'AI-Enabled Process'
              ]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) =>
                value === 'traditional' ? 'Traditional Process' : 'AI-Enabled Process'
              }
            />
            <Bar dataKey="traditional" fill="#9ca3af" radius={[8, 8, 0, 0]} />
            <Bar dataKey="aiEnabled" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              <LabelList content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeToMarketComparison;
