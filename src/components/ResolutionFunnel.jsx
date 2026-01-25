import React from 'react';
import { AWS_COLORS } from '../utils/chartConfig';
import './ResolutionFunnel.css';

const ResolutionFunnel = () => {
  const stages = [
    { name: 'Total Queries Received', count: 50000, percentage: 100, color: AWS_COLORS.primary },
    { name: 'AI Self-Service Resolved', count: 32500, percentage: 65, color: AWS_COLORS.success },
    { name: 'AI-Assisted (Human + AI)', count: 12000, percentage: 24, color: '#8b5cf6' },
    { name: 'Human-Only Escalation', count: 4500, percentage: 9, color: AWS_COLORS.warning },
    { name: 'Unresolved', count: 1000, percentage: 2, color: AWS_COLORS.danger }
  ];

  return (
    <div className="panel resolution-funnel-panel">
      <h2 className="panel-title">Resolution Funnel</h2>
      <div className="funnel-summary">
        <div className="summary-stat">
          <span className="summary-label">AI Resolution Rate</span>
          <span className="summary-value positive">89%</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Resolution Rate</span>
          <span className="summary-value">98%</span>
        </div>
      </div>
      <div className="funnel-container">
        {stages.map((stage, index) => {
          const width = stage.percentage;
          return (
            <div key={index} className="funnel-stage">
              <div
                className="funnel-bar"
                style={{
                  width: `${width}%`,
                  background: stage.color
                }}
              >
                <div className="funnel-content">
                  <span className="funnel-name">{stage.name}</span>
                  <span className="funnel-stats">
                    {stage.count.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResolutionFunnel;
