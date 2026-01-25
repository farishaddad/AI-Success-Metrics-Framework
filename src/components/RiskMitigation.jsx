import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import './PillarContent.css';

const RiskMitigation = () => {
  const riskEventsData = [
    { month: 'Jan', fraud: 45, compliance: 12, security: 8 },
    { month: 'Feb', fraud: 42, compliance: 11, security: 7 },
    { month: 'Mar', fraud: 38, compliance: 10, security: 6, annotation: 'AI Fraud Detection' },
    { month: 'Apr', fraud: 32, compliance: 9, security: 5 },
    { month: 'May', fraud: 28, compliance: 8, security: 4 },
    { month: 'Jun', fraud: 24, compliance: 7, security: 4, annotation: 'AI Compliance Monitor' },
    { month: 'Jul', fraud: 20, compliance: 5, security: 3 },
    { month: 'Aug', fraud: 18, compliance: 4, security: 3 },
    { month: 'Sep', fraud: 15, compliance: 3, security: 2, annotation: 'AI Security Scanner' },
    { month: 'Oct', fraud: 12, compliance: 3, security: 2 },
    { month: 'Nov', fraud: 10, compliance: 2, security: 1 },
    { month: 'Dec', fraud: 8, compliance: 2, security: 1 }
  ];

  const financialImpactData = [
    {
      category: 'Fraud',
      potentialLoss: 2800,
      actualLoss: 420,
      savings: 2380
    },
    {
      category: 'Compliance',
      potentialLoss: 1500,
      actualLoss: 180,
      savings: 1320
    },
    {
      category: 'Security',
      potentialLoss: 950,
      actualLoss: 120,
      savings: 830
    },
    {
      category: 'Data Breach',
      potentialLoss: 3200,
      actualLoss: 0,
      savings: 3200
    }
  ];

  const totalPrevented = financialImpactData.reduce((sum, item) => sum + item.savings, 0);
  const complianceViolations = 24;
  const securityIncidents = 18;

  return (
    <div className="pillar-content-wrapper">
      <div className="summary-metrics">
        <div className="metric-card">
          <span className="metric-label">Fraud Prevented</span>
          <span className="metric-value positive">${(totalPrevented / 1000).toFixed(2)}M</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Compliance Violations Avoided</span>
          <span className="metric-value">{complianceViolations}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Security Incidents Prevented</span>
          <span className="metric-value">{securityIncidents}</span>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Risk Events Over Time</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={riskEventsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Number of Events', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="fraud"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Fraud Events"
              />
              <Line
                type="monotone"
                dataKey="compliance"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Compliance Issues"
              />
              <Line
                type="monotone"
                dataKey="security"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Security Incidents"
              />
              {riskEventsData.filter(d => d.annotation).map((point, index) => (
                <ReferenceLine
                  key={index}
                  x={point.month}
                  stroke="#667eea"
                  strokeDasharray="3 3"
                  label={{ value: '🚀', position: 'top', fill: '#667eea' }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Financial Impact of Risk Mitigation</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={financialImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis label={{ value: 'Financial Impact ($K)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="potentialLoss" fill="#ef4444" name="Potential Loss" radius={[8, 8, 0, 0]} />
              <Bar dataKey="actualLoss" fill="#f59e0b" name="Actual Loss" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="savings-highlight">
          <span className="highlight-label">Total Savings from Risk Mitigation:</span>
          <span className="highlight-value">${(totalPrevented / 1000).toFixed(2)}M</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMitigation;
