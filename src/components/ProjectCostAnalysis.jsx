import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './Panel.css';

const ProjectCostAnalysis = ({ project }) => {
  try {
    if (!project) {
      return <div>No project data</div>;
    }

    const data = [
      { month: 'M1', development: 25, infrastructure: 5, operational: 2, budget: 50 },
      { month: 'M2', development: 55, infrastructure: 12, operational: 5, budget: 100 },
      { month: 'M3', development: 90, infrastructure: 20, operational: 10, budget: 150 },
      { month: 'M4', development: 130, infrastructure: 30, operational: 18, budget: 200 },
      { month: 'M5', development: 175, infrastructure: 42, operational: 28, budget: 250 },
      { month: 'M6', development: 220, infrastructure: 55, operational: 40, budget: 300 },
      { month: 'M7', development: 260, infrastructure: 70, operational: 55, budget: 350 },
      { month: 'M8', development: 295, infrastructure: 85, operational: 72, budget: 400 },
      { month: 'M9', development: 320, infrastructure: 100, operational: 92, budget: 450 }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const total = payload.reduce((sum, entry) => {
          if (entry.dataKey !== 'budget') return sum + entry.value;
          return sum;
        }, 0);
        const budget = payload.find(p => p.dataKey === 'budget')?.value || 0;
        const variance = total - budget;

        return (
          <div style={{
            background: 'white',
            padding: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontWeight: 600, marginBottom: '8px' }}>{label}</p>
            {payload.filter(p => p.dataKey !== 'budget').map((entry, index) => (
              <p key={index} style={{ fontSize: '13px', color: entry.color }}>
                {entry.name}: ${entry.value}K
              </p>
            ))}
            <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '4px' }}>
              Total: ${total}K
            </p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>
              Budget: ${budget}K
            </p>
            <p style={{ 
              fontSize: '13px', 
              fontWeight: 600, 
              color: variance > 0 ? '#ef4444' : '#10b981'
            }}>
              Variance: {variance > 0 ? '+' : ''}${variance}K
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="panel">
        <h2 className="panel-title">Cost Analysis</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Cumulative Cost ($K)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine
                y={project.budget / 1000}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: 'Budget', position: 'right', fill: '#f59e0b', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="development"
                stackId="1"
                stroke="#3b82f6"
                fill="url(#colorDev)"
                name="Development Costs"
              />
              <Area
                type="monotone"
                dataKey="infrastructure"
                stackId="1"
                stroke="#8b5cf6"
                fill="url(#colorInfra)"
                name="Infrastructure Costs"
              />
              <Area
                type="monotone"
                dataKey="operational"
                stackId="1"
                stroke="#10b981"
                fill="url(#colorOps)"
                name="Operational Costs"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ProjectCostAnalysis:', error);
    return <div style={{ padding: '20px', color: '#ef4444' }}>Error loading cost analysis: {error.message}</div>;
  }
};

export default ProjectCostAnalysis;
