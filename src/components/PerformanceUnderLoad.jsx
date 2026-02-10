import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ZAxis } from 'recharts';
import './Panel.css';

const PerformanceUnderLoad = () => {
  const data = [
    // Week 1 - Blue
    ...Array.from({ length: 15 }, (_, i) => ({
      volume: 10 + Math.random() * 40,
      latency: 80 + Math.random() * 40,
      period: 'Week 1',
      color: '#3b82f6'
    })),
    // Week 2 - Green
    ...Array.from({ length: 15 }, (_, i) => ({
      volume: 20 + Math.random() * 50,
      latency: 90 + Math.random() * 50,
      period: 'Week 2',
      color: '#10b981'
    })),
    // Week 3 - Yellow
    ...Array.from({ length: 15 }, (_, i) => ({
      volume: 30 + Math.random() * 60,
      latency: 100 + Math.random() * 60,
      period: 'Week 3',
      color: '#f59e0b'
    })),
    // Week 4 - Purple (with incidents)
    ...Array.from({ length: 12 }, (_, i) => ({
      volume: 40 + Math.random() * 70,
      latency: 110 + Math.random() * 70,
      period: 'Week 4',
      color: '#8b5cf6'
    })),
    // Incidents
    { volume: 95, latency: 285, period: 'Incident', color: '#ef4444', incident: true },
    { volume: 102, latency: 310, period: 'Incident', color: '#ef4444', incident: true }
  ];

  const CustomTooltip = ({ active, payload }) => {
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
          <p style={{ fontWeight: 600, marginBottom: '8px', color: data.color }}>
            {data.incident ? '⚠ Incident' : data.period}
          </p>
          <p style={{ fontSize: '13px' }}>Volume: {data.volume.toFixed(1)} req/s</p>
          <p style={{ fontSize: '13px' }}>Latency: {data.latency.toFixed(0)} ms</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Performance Under Load</h2>
      <div className="metric-summary">
        <div className="summary-stat">
          <span className="summary-label">Avg Latency</span>
          <span className="summary-value">142ms</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">SLA Compliance</span>
          <span className="summary-value positive">96.8%</span>
        </div>
        <div className="summary-stat">
          <span className="summary-label">Incidents</span>
          <span className="summary-value" style={{ color: '#ef4444' }}>2</span>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="volume"
              name="Volume"
              unit=" req/s"
              label={{ value: 'Request Volume (req/s)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="latency"
              name="Latency"
              unit=" ms"
              label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
            />
            <ZAxis range={[50, 50]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={200}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'SLA: 200ms', position: 'right', fill: '#ef4444', fontWeight: 600 }}
            />
            <Scatter name="Week 1" data={data.filter(d => d.period === 'Week 1')} fill="#3b82f6" />
            <Scatter name="Week 2" data={data.filter(d => d.period === 'Week 2')} fill="#10b981" />
            <Scatter name="Week 3" data={data.filter(d => d.period === 'Week 3')} fill="#f59e0b" />
            <Scatter name="Week 4" data={data.filter(d => d.period === 'Week 4')} fill="#8b5cf6" />
            <Scatter
              name="Incidents"
              data={data.filter(d => d.incident)}
              fill="#ef4444"
              shape="star"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceUnderLoad;
