import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './BaselineMetrics.css';

const BaselineMetrics = ({ project }) => {
  try {
    if (!project) {
      return <div>No project data</div>;
    }

    const getMetricsForProject = (type) => {
      const commonMetrics = [
        {
          name: 'Response Time',
          baseline: 4.5,
          current: 1.2,
          unit: 'sec',
          target: 2.0,
          trend: [4.5, 4.2, 3.8, 3.2, 2.5, 1.8, 1.2],
          status: 'on-track'
        },
        {
          name: 'Accuracy',
          baseline: 85,
          current: 94,
          unit: '%',
          target: 90,
          trend: [85, 87, 89, 91, 92, 93, 94],
          status: 'on-track'
        },
        {
          name: 'Cost per Transaction',
          baseline: 2.50,
          current: 0.85,
          unit: '$',
          target: 1.50,
          trend: [2.5, 2.2, 1.9, 1.5, 1.2, 1.0, 0.85],
          status: 'on-track'
        }
      ];

      if (type === 'customer-facing') {
        return [
          ...commonMetrics,
          {
            name: 'CSAT Score',
            baseline: 3.8,
            current: 4.6,
            unit: '/5',
            target: 4.2,
            trend: [3.8, 4.0, 4.2, 4.3, 4.4, 4.5, 4.6],
            status: 'on-track'
          },
          {
            name: 'Resolution Rate',
            baseline: 72,
            current: 89,
            unit: '%',
            target: 85,
            trend: [72, 75, 78, 82, 85, 87, 89],
            status: 'on-track'
          }
        ];
      }

      return commonMetrics;
    };

    const metrics = getMetricsForProject(project.type);

    const getStatusIcon = (status) => {
      switch (status) {
        case 'on-track': return '✓';
        case 'at-risk': return '⚠';
        case 'off-track': return '✕';
        default: return '○';
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'on-track': return '#10b981';
        case 'at-risk': return '#f59e0b';
        case 'off-track': return '#ef4444';
        default: return '#6b7280';
      }
    };

    return (
      <div className="panel baseline-metrics-panel">
        <h2 className="panel-title">Baseline vs. Current Metrics</h2>
        <div className="metrics-table-container">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Metric Name</th>
                <th>Baseline</th>
                <th>Current</th>
                <th>Change</th>
                <th>Trend</th>
                <th>Target</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => {
                const change = metric.current - metric.baseline;
                const changePercent = ((change / metric.baseline) * 100).toFixed(1);
                const isPositive = change > 0;
                const trendData = metric.trend.map((value, idx) => ({ value, index: idx }));

                return (
                  <tr key={index} className={`metric-row ${metric.status}`}>
                    <td className="metric-name">{metric.name}</td>
                    <td className="metric-value">{metric.baseline}{metric.unit}</td>
                    <td className="metric-value current">{metric.current}{metric.unit}</td>
                    <td className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? '+' : ''}{change.toFixed(2)}{metric.unit}
                      <span className="change-percent">({isPositive ? '+' : ''}{changePercent}%)</span>
                    </td>
                    <td className="metric-trend">
                      <ResponsiveContainer width={80} height={30}>
                        <LineChart data={trendData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={getStatusColor(metric.status)}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </td>
                    <td className="metric-target">{metric.target}{metric.unit}</td>
                    <td className="metric-status">
                      <span
                        className="status-icon"
                        style={{ color: getStatusColor(metric.status) }}
                      >
                        {getStatusIcon(metric.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in BaselineMetrics:', error);
    return <div style={{ padding: '20px', color: '#ef4444' }}>Error loading metrics: {error.message}</div>;
  }
};

export default BaselineMetrics;
