import React from 'react';
import './Panel.css';

const StrategicAlignmentPanel = () => {
  const metrics = [
    { name: 'Business Impact', actual: 88, target: 80 },
    { name: 'Innovation Capacity', actual: 75, target: 80 },
    { name: 'Customer Experience', actual: 92, target: 80 },
    { name: 'Operational Efficiency', actual: 85, target: 80 }
  ];

  return (
    <div className="panel">
      <h2 className="panel-title">Strategic Alignment Score</h2>
      <div className="alignment-content">
        {metrics.map((metric, index) => (
          <div key={index} className="bullet-chart">
            <div className="bullet-label">{metric.name}</div>
            <div className="bullet-container">
              <div className="bullet-background">
                <div className="bullet-target" style={{ left: `${metric.target}%` }}>
                  <div className="target-line"></div>
                </div>
                <div
                  className={`bullet-bar ${metric.actual >= metric.target ? 'above-target' : 'below-target'}`}
                  style={{ width: `${metric.actual}%` }}
                >
                  <span className="bullet-value">{metric.actual}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="alignment-legend">
          <div className="legend-item">
            <div className="legend-line"></div>
            <span>Target: 80%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicAlignmentPanel;
