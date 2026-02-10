import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { AWS_COLORS } from '../utils/chartConfig';
import './Panel.css';

const ChurnAnalysis = () => {
  const data = [
    { month: 'Jan', overall: 5.8, aiEngaged: 5.8 },
    { month: 'Feb', overall: 5.7, aiEngaged: 5.6 },
    { month: 'Mar', overall: 5.6, aiEngaged: 5.2, annotation: 'AI Chat Launch' },
    { month: 'Apr', overall: 5.5, aiEngaged: 4.8 },
    { month: 'May', overall: 5.4, aiEngaged: 4.3 },
    { month: 'Jun', overall: 5.3, aiEngaged: 3.9, annotation: 'AI Recommendations' },
    { month: 'Jul', overall: 5.2, aiEngaged: 3.5 },
    { month: 'Aug', overall: 5.1, aiEngaged: 3.2 },
    { month: 'Sep', overall: 5.0, aiEngaged: 2.9 },
    { month: 'Oct', overall: 4.9, aiEngaged: 2.7, annotation: 'Predictive Support' },
    { month: 'Nov', overall: 4.8, aiEngaged: 2.5 },
    { month: 'Dec', overall: 4.7, aiEngaged: 2.3 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = data.find(d => d.month === label);
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>{label}</p>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>Overall: {payload[0].value}%</p>
          <p style={{ color: AWS_COLORS.primary, fontSize: '13px' }}>AI-Engaged: {payload[1].value}%</p>
          <p style={{ color: AWS_COLORS.success, fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
            Reduction: {(payload[0].value - payload[1].value).toFixed(1)}%
          </p>
          {dataPoint?.annotation && (
            <p style={{ color: AWS_COLORS.primary, fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>
              🚀 {dataPoint.annotation}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Churn Analysis</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Overall Churn</span>
          <span className="summary-value">4.7%</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">AI-Engaged Churn</span>
          <span className="summary-value positive">2.3%</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Reduction</span>
          <span className="summary-value positive">-51%</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="churnReduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={AWS_COLORS.success} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={AWS_COLORS.success} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Churn Rate (%)', angle: -90, position: 'insideLeft' }} domain={[0, 7]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="overall"
              fill="url(#churnReduction)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="overall"
              stroke="#9ca3af"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Overall Churn"
            />
            <Line
              type="monotone"
              dataKey="aiEngaged"
              stroke={AWS_COLORS.primary}
              strokeWidth={3}
              dot={{ r: 4 }}
              name="AI-Engaged Customers"
            />
            {data.filter(d => d.annotation).map((point, index) => (
              <ReferenceLine
                key={index}
                x={point.month}
                stroke={AWS_COLORS.primary}
                strokeDasharray="3 3"
                label={{ value: '🚀', position: 'top', fill: AWS_COLORS.primary }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChurnAnalysis;
