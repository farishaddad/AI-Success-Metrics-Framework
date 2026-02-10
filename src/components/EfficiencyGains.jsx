import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, AreaChart, Area, Line, ComposedChart } from 'recharts';
import './PillarContent.css';

const EfficiencyGains = () => {
  const waterfallData = [
    { name: 'Total Manual Hours', value: 50000, type: 'total', color: '#9ca3af' },
    { name: 'Document Processing', value: -12000, type: 'decrease', color: '#10b981' },
    { name: 'Data Entry', value: -8500, type: 'decrease', color: '#10b981' },
    { name: 'Report Generation', value: -6200, type: 'decrease', color: '#10b981' },
    { name: 'Customer Support', value: -9800, type: 'decrease', color: '#10b981' },
    { name: 'Quality Checks', value: -4500, type: 'decrease', color: '#10b981' },
    { name: 'Remaining Manual', value: 9000, type: 'total', color: '#3b82f6' }
  ];

  const savingsTrendData = [
    { month: 'Jan', monthly: 85, cumulative: 85, target: 100 },
    { month: 'Feb', monthly: 92, cumulative: 177, target: 200 },
    { month: 'Mar', monthly: 105, cumulative: 282, target: 300 },
    { month: 'Apr', monthly: 118, cumulative: 400, target: 400 },
    { month: 'May', monthly: 125, cumulative: 525, target: 500 },
    { month: 'Jun', monthly: 132, cumulative: 657, target: 600 },
    { month: 'Jul', monthly: 140, cumulative: 797, target: 700 },
    { month: 'Aug', monthly: 145, cumulative: 942, target: 800 },
    { month: 'Sep', monthly: 152, cumulative: 1094, target: 900 },
    { month: 'Oct', monthly: 158, cumulative: 1252, target: 1000 },
    { month: 'Nov', monthly: 165, cumulative: 1417, target: 1100 },
    { month: 'Dec', monthly: 172, cumulative: 1589, target: 1200 }
  ];

  const totalSaved = 41000;
  const automationPercentage = ((totalSaved / 50000) * 100).toFixed(0);

  return (
    <div className="pillar-content-wrapper">
      <div className="summary-metrics">
        <div className="metric-card">
          <span className="metric-label">Total Hours Saved</span>
          <span className="metric-value">{totalSaved.toLocaleString()}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Cost Savings</span>
          <span className="metric-value positive">$1.59M</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Productivity Improvement</span>
          <span className="metric-value positive">{automationPercentage}%</span>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Time Savings by Process</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${Math.abs(value).toLocaleString()} hours`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Cost Savings Trend</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={savingsTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMonthlySavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" label={{ value: 'Monthly Savings ($K)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Cumulative ($K)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="monthly"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorMonthlySavings)"
                name="Monthly Savings"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Cumulative Savings"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="target"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyGains;
