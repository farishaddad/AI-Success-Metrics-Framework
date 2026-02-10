import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AWS_COLORS } from '../utils/chartConfig';
import './Panel.css';

const ModelPerformanceTimeSeries = ({ project }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);

  try {
    if (!project) {
      return <div>No project data</div>;
    }

    // Sample incident details
    const incidentDetails = {
      'D9': {
        id: 'INC-2024-001',
        severity: 'High',
        type: 'Performance Degradation',
        detectedAt: '2024-01-09 14:23:15',
        resolvedAt: '2024-01-09 15:47:32',
        duration: '1h 24m',
        affectedUsers: 1247,
        rootCause: 'Database connection pool exhaustion due to increased load',
        resolution: 'Scaled up connection pool size and optimized slow queries',
        impact: 'Latency increased by 340%, accuracy dropped to 89.2%',
        assignedTo: 'DevOps Team',
        status: 'Resolved'
      },
      'D23': {
        id: 'INC-2024-002',
        severity: 'Critical',
        type: 'Model Accuracy Drop',
        detectedAt: '2024-01-23 09:15:42',
        resolvedAt: '2024-01-23 11:03:18',
        duration: '1h 48m',
        affectedUsers: 2891,
        rootCause: 'Data drift detected - training data distribution mismatch',
        resolution: 'Triggered model retraining with updated dataset and deployed new version',
        impact: 'Accuracy dropped to 87.5%, increased false positive rate by 23%',
        assignedTo: 'ML Engineering Team',
        status: 'Resolved'
      }
    };

    const data = Array.from({ length: 30 }, (_, i) => ({
      day: `D${i + 1}`,
      accuracy: 92 + Math.random() * 3 - 1.5,
      latency: 120 + Math.random() * 40 - 20,
      throughput: 1800 + Math.random() * 400 - 200,
      incident: i === 8 || i === 22 ? '⚠ Incident' : null
    }));

    const CustomTooltip = ({ active, payload, label }) => {
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
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>{label}</p>
            <p style={{ fontSize: '13px', color: AWS_COLORS.primary }}>
              Accuracy: {data.accuracy.toFixed(2)}%
            </p>
            <p style={{ fontSize: '13px', color: AWS_COLORS.warning }}>
              Latency: {data.latency.toFixed(0)}ms
            </p>
            <p style={{ fontSize: '13px', color: AWS_COLORS.success }}>
              Throughput: {data.throughput.toFixed(0)} req/s
            </p>
            {data.incident && (
              <p style={{ fontSize: '12px', marginTop: '8px', color: AWS_COLORS.danger, fontWeight: 600 }}>
                {data.incident} - Click red dot for details
              </p>
            )}
          </div>
        );
      }
      return null;
    };

    const CustomDot = (props) => {
      const { cx, cy, payload } = props;
      if (payload.incident) {
        return (
          <g 
            onClick={() => setSelectedIncident(incidentDetails[payload.day])}
            style={{ cursor: 'pointer' }}
          >
            <circle 
              cx={cx} 
              cy={cy} 
              r={8} 
              fill={AWS_COLORS.danger} 
              stroke="#fff" 
              strokeWidth={2}
              style={{ 
                filter: 'drop-shadow(0 2px 4px rgba(209, 50, 18, 0.4))',
                transition: 'all 0.2s ease'
              }}
            />
            <circle 
              cx={cx} 
              cy={cy} 
              r={8} 
              fill="transparent" 
              stroke={AWS_COLORS.danger} 
              strokeWidth={2}
              opacity={0.3}
            >
              <animate
                attributeName="r"
                from="8"
                to="14"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.3"
                to="0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <text 
              x={cx} 
              y={cy - 18} 
              textAnchor="middle" 
              fill={AWS_COLORS.danger} 
              fontSize={16}
              fontWeight="bold"
            >
              ⚠
            </text>
          </g>
        );
      }
      return null;
    };

    const IncidentPopup = ({ incident, onClose }) => {
      if (!incident) return null;

      const getSeverityColor = (severity) => {
        switch (severity.toLowerCase()) {
          case 'critical': return AWS_COLORS.danger;
          case 'high': return AWS_COLORS.warning;
          case 'medium': return AWS_COLORS.primary;
          default: return AWS_COLORS.neutral;
        }
      };

      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideUp 0.3s ease-out',
            position: 'relative'
          }}>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: AWS_COLORS.neutral,
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = AWS_COLORS.secondaryBg;
                e.target.style.color = AWS_COLORS.danger;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = AWS_COLORS.neutral;
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '32px' }}>⚠️</span>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 700, 
                  color: AWS_COLORS.primary,
                  margin: 0
                }}>
                  Incident Details
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  background: getSeverityColor(incident.severity),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {incident.severity}
                </span>
                <span style={{
                  background: AWS_COLORS.success,
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {incident.status}
                </span>
                <span style={{
                  color: AWS_COLORS.neutral,
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  {incident.id}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Type */}
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: AWS_COLORS.neutral,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Incident Type
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 600,
                  color: AWS_COLORS.primary
                }}>
                  {incident.type}
                </div>
              </div>

              {/* Timeline */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '16px',
                background: AWS_COLORS.secondaryBg,
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: AWS_COLORS.neutral, marginBottom: '4px' }}>
                    Detected At
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: AWS_COLORS.primary }}>
                    {incident.detectedAt}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: AWS_COLORS.neutral, marginBottom: '4px' }}>
                    Resolved At
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: AWS_COLORS.success }}>
                    {incident.resolvedAt}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: AWS_COLORS.neutral, marginBottom: '4px' }}>
                    Duration
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: AWS_COLORS.warning }}>
                    {incident.duration}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: AWS_COLORS.neutral, marginBottom: '4px' }}>
                    Affected Users
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: AWS_COLORS.danger }}>
                    {incident.affectedUsers.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: AWS_COLORS.neutral,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Impact
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: AWS_COLORS.danger,
                  padding: '12px',
                  background: 'rgba(209, 50, 18, 0.05)',
                  borderLeft: `4px solid ${AWS_COLORS.danger}`,
                  borderRadius: '4px'
                }}>
                  {incident.impact}
                </div>
              </div>

              {/* Root Cause */}
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: AWS_COLORS.neutral,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Root Cause
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: AWS_COLORS.neutral,
                  lineHeight: '1.6'
                }}>
                  {incident.rootCause}
                </div>
              </div>

              {/* Resolution */}
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: AWS_COLORS.neutral,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Resolution
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: AWS_COLORS.success,
                  padding: '12px',
                  background: 'rgba(29, 129, 2, 0.05)',
                  borderLeft: `4px solid ${AWS_COLORS.success}`,
                  borderRadius: '4px'
                }}>
                  {incident.resolution}
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: AWS_COLORS.neutral,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Assigned To
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: AWS_COLORS.primary
                }}>
                  {incident.assignedTo}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{ 
              marginTop: '32px', 
              paddingTop: '24px', 
              borderTop: `1px solid ${AWS_COLORS.secondaryBg}`,
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 24px',
                  background: AWS_COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#005a94';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 115, 187, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = AWS_COLORS.primary;
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      );
    };

    return (
      <div className="panel">
        <h2 className="panel-title">Model Performance (Time Series)</h2>
        <p style={{ 
          fontSize: '13px', 
          color: AWS_COLORS.neutral, 
          marginBottom: '16px',
          fontStyle: 'italic'
        }}>
          Click on incident markers (⚠) to view detailed information
        </p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" label={{ value: 'Accuracy (%) / Latency (ms)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Throughput (req/s)', angle: 90, position: 'insideRight' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                stroke={AWS_COLORS.primary}
                strokeWidth={2}
                dot={<CustomDot />}
                name="Accuracy (%)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="latency"
                stroke={AWS_COLORS.warning}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Latency (ms)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="throughput"
                stroke={AWS_COLORS.success}
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Throughput (req/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <IncidentPopup 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error in ModelPerformanceTimeSeries:', error);
    return <div style={{ padding: '20px', color: AWS_COLORS.danger }}>Error loading model performance: {error.message}</div>;
  }
};

export default ModelPerformanceTimeSeries;
