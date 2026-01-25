import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import './Panel.css';

const ClassificationMetrics = () => {
  const data = [
    {
      metric: 'Accuracy',
      'Fraud Detection': 92,
      'Sentiment Analysis': 94,
      'Document Classifier': 89,
      target: 90
    },
    {
      metric: 'Precision',
      'Fraud Detection': 91,
      'Sentiment Analysis': 93,
      'Document Classifier': 87,
      target: 90
    },
    {
      metric: 'Recall',
      'Fraud Detection': 88,
      'Sentiment Analysis': 91,
      'Document Classifier': 85,
      target: 90
    },
    {
      metric: 'F1-Score',
      'Fraud Detection': 89,
      'Sentiment Analysis': 92,
      'Document Classifier': 86,
      target: 90
    },
    {
      metric: 'AUC-ROC',
      'Fraud Detection': 94,
      'Sentiment Analysis': 95,
      'Document Classifier': 91,
      target: 90
    }
  ];

  return (
    <div className="panel">
      <h2 className="panel-title">Classification Metrics</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 13, fontWeight: 500 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Radar
              name="Target Threshold"
              dataKey="target"
              stroke="#9ca3af"
              fill="#9ca3af"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Radar
              name="Fraud Detection"
              dataKey="Fraud Detection"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Sentiment Analysis"
              dataKey="Sentiment Analysis"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Document Classifier"
              dataKey="Document Classifier"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClassificationMetrics;
