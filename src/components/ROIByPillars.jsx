import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import './Panel.css';

const ROIByPillars = () => {
  const data = [
    {
      pillar: 'Efficiency Gains',
      investment: 800,
      returns: 2200,
      netROI: 175
    },
    {
      pillar: 'Revenue Generation',
      investment: 1200,
      returns: 3800,
      netROI: 217
    },
    {
      pillar: 'Risk Mitigation',
      investment: 600,
      returns: 1500,
      netROI: 150
    },
    {
      pillar: 'Business Agility',
      investment: 400,
      returns: 1100,
      netROI: 175
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const netGain = data.returns - data.investment;
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>{label}</p>
          <p style={{ fontSize: '13px', color: '#ef4444' }}>Investment: ${data.investment}K</p>
          <p style={{ fontSize: '13px', color: '#10b981' }}>Returns: ${data.returns}K</p>
          <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '8px', color: '#3b82f6' }}>
            Net Gain: ${netGain}K
          </p>
          <p style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px', color: '#667eea' }}>
            ROI: {data.netROI}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props) => {
    try {
      const { x, y, width, height } = props;
      const data = props.payload;
      
      if (!data || !data.netROI) return null;
      
      return (
        <text
          x={x + width + 10}
          y={y + height / 2}
          fill="#667eea"
          textAnchor="start"
          fontSize="14"
          fontWeight="700"
          dominantBaseline="middle"
        >
          ROI: {data.netROI}%
        </text>
      );
    } catch (error) {
      console.error('Error in CustomLabel:', error);
      return null;
    }
  };

  return (
    <div className="panel roi-pillars-panel">
      <h2 className="panel-title">ROI by Four Pillars</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Total Investment</span>
          <span className="summary-value">$3.0M</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Total Returns</span>
          <span className="summary-value positive">$8.6M</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Net Gain</span>
          <span className="summary-value positive">$5.6M</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 100, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" label={{ value: 'Amount ($K)', position: 'insideBottom', offset: -5 }} />
            <YAxis type="category" dataKey="pillar" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="investment" fill="#ef4444" name="Investment" radius={[0, 4, 4, 0]} />
            <Bar dataKey="returns" fill="#10b981" name="Returns" radius={[0, 4, 4, 0]}>
              <LabelList content={<CustomLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ROIByPillars;
