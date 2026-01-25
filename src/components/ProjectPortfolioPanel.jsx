import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import './Panel.css';

const ProjectPortfolioPanel = () => {
  const data = [
    { name: 'Production', value: 12, color: '#10b981' },
    { name: 'Pilot', value: 5, color: '#f59e0b' },
    { name: 'Development', value: 8, color: '#3b82f6' },
    { name: 'On Hold', value: 3, color: '#9ca3af' }
  ];

  const totalProjects = data.reduce((sum, item) => sum + item.value, 0);

  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <text
        x={cx}
        y={cy}
        fill="#2c3e50"
        textAnchor="middle"
        dominantBaseline="central"
        className="donut-center-text"
      >
        <tspan x={cx} dy="-0.5em" fontSize="36" fontWeight="700">
          {totalProjects}
        </tspan>
        <tspan x={cx} dy="1.5em" fontSize="14" fill="#6b7280">
          Projects
        </tspan>
      </text>
    );
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="custom-legend">
        {payload.map((entry, index) => {
          const percentage = ((entry.payload.value / totalProjects) * 100).toFixed(0);
          return (
            <div key={`legend-${index}`} className="legend-item">
              <div className="legend-color" style={{ background: entry.color }}></div>
              <span className="legend-name">{entry.value}</span>
              <span className="legend-value">{entry.payload.value} ({percentage}%)</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="panel">
      <h2 className="panel-title">Project Portfolio Status</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend content={renderLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectPortfolioPanel;
