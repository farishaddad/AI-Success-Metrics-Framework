import React from 'react';
import './GenAIMetrics.css';

const GenAIMetrics = () => {
  const metrics = [
    {
      name: 'Hallucination Rate',
      value: 3.2,
      target: 5,
      unit: '%',
      inverse: true, // lower is better
      zones: [
        { max: 5, color: '#10b981', label: 'Excellent' },
        { max: 10, color: '#f59e0b', label: 'Acceptable' },
        { max: 100, color: '#ef4444', label: 'Critical' }
      ]
    },
    {
      name: 'Grounded Response',
      value: 96.5,
      target: 95,
      unit: '%',
      inverse: false, // higher is better
      zones: [
        { max: 80, color: '#ef4444', label: 'Critical' },
        { max: 95, color: '#f59e0b', label: 'Acceptable' },
        { max: 100, color: '#10b981', label: 'Excellent' }
      ]
    },
    {
      name: 'Response Relevance',
      value: 93.8,
      target: 90,
      unit: '%',
      inverse: false,
      zones: [
        { max: 70, color: '#ef4444', label: 'Critical' },
        { max: 90, color: '#f59e0b', label: 'Acceptable' },
        { max: 100, color: '#10b981', label: 'Excellent' }
      ]
    }
  ];

  const getGaugeColor = (value, zones, inverse) => {
    if (inverse) {
      if (value <= zones[0].max) return zones[0].color;
      if (value <= zones[1].max) return zones[1].color;
      return zones[2].color;
    } else {
      if (value < zones[0].max) return zones[0].color;
      if (value < zones[1].max) return zones[1].color;
      return zones[2].color;
    }
  };

  const getStatus = (value, zones, inverse) => {
    if (inverse) {
      if (value <= zones[0].max) return zones[0].label;
      if (value <= zones[1].max) return zones[1].label;
      return zones[2].label;
    } else {
      if (value < zones[0].max) return zones[0].label;
      if (value < zones[1].max) return zones[1].label;
      return zones[2].label;
    }
  };

  const Gauge = ({ metric }) => {
    const percentage = metric.inverse ? 100 - metric.value : metric.value;
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (percentage / 100) * circumference;
    const color = getGaugeColor(metric.value, metric.zones, metric.inverse);
    const status = getStatus(metric.value, metric.zones, metric.inverse);

    return (
      <div className="gauge-card">
        <h3 className="gauge-title">{metric.name}</h3>
        <div className="gauge-visual">
          <svg className="gauge-svg" viewBox="0 0 140 140">
            <circle
              className="gauge-bg"
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              className="gauge-fill"
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className="gauge-center">
            <div className="gauge-value" style={{ color }}>
              {metric.value}{metric.unit}
            </div>
            <div className="gauge-status" style={{ color }}>{status}</div>
          </div>
        </div>
        <div className="gauge-target">
          Target: {metric.inverse ? '<' : '>'}{metric.target}{metric.unit}
        </div>
      </div>
    );
  };

  return (
    <div className="panel genai-metrics-panel">
      <h2 className="panel-title">GenAI Specific Metrics</h2>
      <div className="gauge-cluster">
        {metrics.map((metric, index) => (
          <Gauge key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default GenAIMetrics;
