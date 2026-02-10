import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './PillarContent.css';

const RevenueGeneration = () => {
  const sunburstData = [
    // New Products
    { name: 'AI Chatbot', value: 1200, category: 'New Products', color: '#3b82f6' },
    { name: 'Recommendation Engine', value: 980, category: 'New Products', color: '#60a5fa' },
    { name: 'Predictive Analytics', value: 620, category: 'New Products', color: '#93c5fd' },
    // Cross-sell
    { name: 'Smart Bundling', value: 580, category: 'Cross-sell', color: '#10b981' },
    { name: 'Product Suggestions', value: 420, category: 'Cross-sell', color: '#34d399' },
    { name: 'Personalized Offers', value: 220, category: 'Cross-sell', color: '#6ee7b7' },
    // Up-sell
    { name: 'Premium Features', value: 680, category: 'Up-sell', color: '#8b5cf6' },
    { name: 'Tier Upgrades', value: 520, category: 'Up-sell', color: '#a78bfa' },
    { name: 'Add-on Services', value: 300, category: 'Up-sell', color: '#c4b5fd' },
    // Retention
    { name: 'Churn Prevention', value: 450, category: 'Retention', color: '#f59e0b' },
    { name: 'Loyalty Programs', value: 320, category: 'Retention', color: '#fbbf24' },
    { name: 'Win-back Campaigns', value: 130, category: 'Retention', color: '#fcd34d' }
  ];

  const funnelData = {
    before: [
      { stage: 'Awareness', value: 100000, conversion: 100 },
      { stage: 'Interest', value: 35000, conversion: 35 },
      { stage: 'Consideration', value: 12250, conversion: 12.25 },
      { stage: 'Purchase', value: 3675, conversion: 3.68 }
    ],
    after: [
      { stage: 'Awareness', value: 100000, conversion: 100 },
      { stage: 'Interest', value: 48000, conversion: 48 },
      { stage: 'Consideration', value: 19200, conversion: 19.2 },
      { stage: 'Purchase', value: 6720, conversion: 6.72 }
    ]
  };

  const totalRevenue = sunburstData.reduce((sum, item) => sum + item.value, 0);
  const revenuePerInitiative = (totalRevenue / sunburstData.length).toFixed(0);
  const conversionImprovement = ((6.72 - 3.68) / 3.68 * 100).toFixed(0);

  const categoryTotals = sunburstData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value;
    return acc;
  }, {});

  return (
    <div className="pillar-content-wrapper">
      <div className="summary-metrics">
        <div className="metric-card">
          <span className="metric-label">Total AI-Attributed Revenue</span>
          <span className="metric-value positive">${(totalRevenue / 1000).toFixed(2)}M</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Revenue per Initiative</span>
          <span className="metric-value">${revenuePerInitiative}K</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Conversion Rate Improvement</span>
          <span className="metric-value positive">+{conversionImprovement}%</span>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Revenue Sources (Sunburst)</h2>
        <div className="revenue-grid">
          <div className="sunburst-container">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={sunburstData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  dataKey="value"
                  label={(entry) => `${entry.name}: $${entry.value}K`}
                  labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                >
                  {sunburstData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}K`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="category-breakdown">
            <h3 className="breakdown-title">By Category</h3>
            {Object.entries(categoryTotals).map(([category, value], index) => (
              <div key={index} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-value">${value}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">Conversion Funnel Impact</h2>
        <div className="funnel-comparison">
          <div className="funnel-side">
            <h3 className="funnel-title">Before AI</h3>
            {funnelData.before.map((stage, index) => {
              const width = stage.conversion;
              return (
                <div key={index} className="funnel-stage-wrapper">
                  <div
                    className="funnel-stage before"
                    style={{ width: `${width}%` }}
                  >
                    <span className="stage-name">{stage.stage}</span>
                    <span className="stage-value">{stage.value.toLocaleString()} ({stage.conversion}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="funnel-side">
            <h3 className="funnel-title">After AI</h3>
            {funnelData.after.map((stage, index) => {
              const width = stage.conversion;
              const improvement = ((stage.conversion - funnelData.before[index].conversion) / funnelData.before[index].conversion * 100).toFixed(0);
              return (
                <div key={index} className="funnel-stage-wrapper">
                  <div
                    className="funnel-stage after"
                    style={{ width: `${width}%` }}
                  >
                    <span className="stage-name">{stage.stage}</span>
                    <span className="stage-value">{stage.value.toLocaleString()} ({stage.conversion}%)</span>
                  </div>
                  {improvement > 0 && (
                    <span className="improvement-badge">+{improvement}%</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGeneration;
