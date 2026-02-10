import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AWS_COLORS } from '../utils/chartConfig';
import './Panel.css';

const ProcessCycleTime = () => {
  const data = [
    { month: 'Jan', beforeAI: 48, afterAI: 28, volume: 1200 },
    { month: 'Feb', beforeAI: 47, afterAI: 26, volume: 1350 },
    { month: 'Mar', beforeAI: 46, afterAI: 24, volume: 1450 },
    { month: 'Apr', beforeAI: 48, afterAI: 22, volume: 1600 },
    { month: 'May', beforeAI: 47, afterAI: 20, volume: 1750 },
    { month: 'Jun', beforeAI: 46, afterAI: 19, volume: 1900 },
    { month: 'Jul', beforeAI: 47, afterAI: 18, volume: 2100 },
    { month: 'Aug', beforeAI: 48, afterAI: 17, volume: 2250 }
  ];

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
          <p style={{ color: AWS_COLORS.danger, fontSize: '13px' }}>Before AI: {data.beforeAI}h</p>
          <p style={{ color: AWS_COLORS.success, fontSize: '13px' }}>After AI: {data.afterAI}h</p>
          <p style={{ color: AWS_COLORS.primary, fontSize: '13px' }}>Volume: {data.volume}</p>
          <p style={{ color: AWS_COLORS.warning, fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
            Saved: {data.beforeAI - data.afterAI}h ({Math.round((1 - data.afterAI / data.beforeAI) * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Process Cycle Time</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Avg Time Saved</span>
          <span className="summary-value">28.5 hours</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Improvement</span>
          <span className="summary-value positive">-62%</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Volume', angle: 90, position: 'insideRight' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="beforeAI"
              fill="#fecaca"
              stroke="none"
              fillOpacity={0.3}
              name="Time Saved"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="beforeAI"
              stroke={AWS_COLORS.danger}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Before AI"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="afterAI"
              stroke={AWS_COLORS.success}
              strokeWidth={3}
              dot={{ r: 4 }}
              name="After AI"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke={AWS_COLORS.primary}
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Volume Processed"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProcessCycleTime;
