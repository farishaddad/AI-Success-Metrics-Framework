import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './Panel.css';

const PaybackTimeline = () => {
  // Project A - Fast payback
  const projectA = Array.from({ length: 25 }, (_, i) => ({
    month: i,
    projectA: i === 0 ? -500 : -500 + (i * 85)
  }));

  // Project B - Medium payback
  const projectB = Array.from({ length: 25 }, (_, i) => ({
    month: i,
    projectB: i === 0 ? -800 : -800 + (i * 95)
  }));

  // Project C - Slow payback
  const projectC = Array.from({ length: 25 }, (_, i) => ({
    month: i,
    projectC: i === 0 ? -1200 : -1200 + (i * 85)
  }));

  // Merge all projects
  const data = projectA.map((item, index) => ({
    month: item.month,
    projectA: item.projectA,
    projectB: projectB[index].projectB,
    projectC: projectC[index].projectC
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>Month {label}</p>
          {payload.map((entry, index) => {
            const value = entry.value;
            const isPositive = value >= 0;
            return (
              <p key={index} style={{ 
                fontSize: '13px', 
                color: entry.color,
                fontWeight: 500
              }}>
                {entry.name}: ${Math.abs(value).toFixed(0)}K {isPositive ? '(Profit)' : '(Investment)'}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Find breakeven points
  const breakevenA = projectA.findIndex(d => d.projectA >= 0);
  const breakevenB = projectB.findIndex(d => d.projectB >= 0);
  const breakevenC = projectC.findIndex(d => d.projectC >= 0);

  return (
    <div className="panel payback-timeline-panel">
      <h2 className="panel-title">Payback Timeline</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Project A Breakeven</span>
          <span className="summary-value">{breakevenA} months</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Project B Breakeven</span>
          <span className="summary-value">{breakevenB} months</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Project C Breakeven</span>
          <span className="summary-value">{breakevenC} months</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProjectA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorProjectB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="colorProjectC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Cumulative Cash Flow ($K)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine
              y={0}
              stroke="#1f2937"
              strokeWidth={2}
              label={{ value: 'Breakeven', position: 'right', fill: '#1f2937', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="projectA"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorProjectA)"
              name="Project A (AI Chatbot)"
            />
            <Area
              type="monotone"
              dataKey="projectB"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorProjectB)"
              name="Project B (Fraud Detection)"
            />
            <Area
              type="monotone"
              dataKey="projectC"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#colorProjectC)"
              name="Project C (Recommendation Engine)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaybackTimeline;
