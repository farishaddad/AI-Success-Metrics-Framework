import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, ComposedChart } from 'recharts';
import './PillarContent.css';

const BusinessAgility = () => {
  const responseTimeData = [
    {
      scenario: 'Market Change Response',
      traditional: 45,
      aiEnabled: 12,
      improvement: 73
    },
    {
      scenario: 'Regulatory Compliance',
      traditional: 52,
      aiEnabled: 17,
      improvement: 67
    },
    {
      scenario: 'New Market Entry',
      traditional: 180,
      aiEnabled: 65,
      improvement: 64
    },
    {
      scenario: 'Product Launch',
      traditional: 120,
      aiEnabled: 48,
      improvement: 60
    },
    {
      scenario: 'Competitive Response',
      traditional: 35,
      aiEnabled: 10,
      improvement: 71
    }
  ];

  const agilityScoreData = [
    { quarter: 'Q1 2024', score: 62, lower: 58, upper: 66, target: 75 },
    { quarter: 'Q2 2024', score: 68, lower: 64, upper: 72, target: 75, annotation: 'AI Deployment' },
    { quarter: 'Q3 2024', score: 74, lower: 70, upper: 78, target: 75 },
    { quarter: 'Q4 2024', score: 79, lower: 75, upper: 83, target: 75, annotation: 'Process Optimization' },
    { quarter: 'Q1 2025', score: 84, lower: 80, upper: 88, target: 75 },
    { quarter: 'Q2 2025', score: 87, lower: 83, upper: 91, target: 75, annotation: 'Full Integration' }
  ];

  const avgResponseTime = responseTimeData.reduce((sum, item) => sum + item.aiEnabled, 0) / responseTimeData.length;
  const avgImprovement = responseTimeData.reduce((sum, item) => sum + item.improvement, 0) / responseTimeData.length;
  const currentAgility = agilityScoreData[agilityScoreData.length - 1].score;

  return (
    <div className="pillar-content-wrapper">
      <div className="summary-metrics">
        <div className="metric-card">
          <span className="metric-label">Avg Time to Adapt</span>
          <span className="metric-value">{avgResponseTime.toFixed(0)} days</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Speed Improvement</span>
          <span className="metric-value positive">{avgImprovement.toFixed(0)}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Agility Index</span>
          <span className="metric-value positive">{currentAgility}/100</span>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Response Time Comparison</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={responseTimeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="scenario"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Response Time (days)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                content={({ active, payload }) => {
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
                        <p style={{ fontWeight: 600, marginBottom: '8px' }}>{data.scenario}</p>
                        <p style={{ fontSize: '13px', color: '#9ca3af' }}>Traditional: {data.traditional} days</p>
                        <p style={{ fontSize: '13px', color: '#3b82f6' }}>AI-Enabled: {data.aiEnabled} days</p>
                        <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px', color: '#10b981' }}>
                          Improvement: {data.improvement}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="traditional" fill="#9ca3af" name="Traditional" radius={[8, 8, 0, 0]} />
              <Bar dataKey="aiEnabled" fill="#3b82f6" name="AI-Enabled" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Agility Score Trend</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={agilityScoreData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="quarter" />
              <YAxis
                domain={[0, 100]}
                label={{ value: 'Agility Index', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload }) => {
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
                        <p style={{ fontWeight: 600, marginBottom: '8px' }}>{data.quarter}</p>
                        <p style={{ fontSize: '13px' }}>Score: {data.score}</p>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                          Confidence: {data.lower}-{data.upper}
                        </p>
                        {data.annotation && (
                          <p style={{ fontSize: '12px', marginTop: '8px', color: '#667eea', fontWeight: 600 }}>
                            🚀 {data.annotation}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="none"
                fill="url(#colorConfidence)"
                name="Confidence Band"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="none"
                fill="white"
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3b82f6' }}
                name="Agility Score"
              />
              <Line
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

export default BusinessAgility;
