import React, { useState } from 'react';
import ProjectSelector from './ProjectSelector';
import ProjectLifecycle from './ProjectLifecycle';
import BaselineMetrics from './BaselineMetrics';
import ProjectCostAnalysis from './ProjectCostAnalysis';
import BusinessImpactScorecard from './BusinessImpactScorecard';
import ModelPerformanceTimeSeries from './ModelPerformanceTimeSeries';
import FeedbackButton from './FeedbackButton';
import './ProjectLevelDashboard.css';

const ProjectLevelDashboard = ({ onFeedbackSubmit }) => {
  try {
    const [selectedProject, setSelectedProject] = useState('chatbot');

    const projects = {
      chatbot: {
        id: 'chatbot',
        name: 'AI Customer Chatbot',
        status: 'Production',
        owner: 'Sarah Chen',
        startDate: '2024-01-15',
        budget: 450000,
        type: 'customer-facing',
        hasModel: true
      },
      fraud: {
        id: 'fraud',
        name: 'Fraud Detection System',
        status: 'Production',
        owner: 'Michael Rodriguez',
        startDate: '2023-09-01',
        budget: 680000,
        type: 'operational',
        hasModel: true
      },
      recommendation: {
        id: 'recommendation',
        name: 'Product Recommendation Engine',
        status: 'Optimization',
        owner: 'Emily Watson',
        startDate: '2024-03-20',
        budget: 520000,
        type: 'revenue',
        hasModel: true
      },
      document: {
        id: 'document',
        name: 'Document Intelligence',
        status: 'Pilot',
        owner: 'David Kim',
        startDate: '2024-06-10',
        budget: 320000,
        type: 'operational',
        hasModel: true
      }
    };

    const currentProject = projects[selectedProject];

    return (
      <div className="project-level-dashboard">
        <ProjectSelector
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />

        <ProjectLifecycle project={currentProject} />

        <BaselineMetrics project={currentProject} />

        <div className="project-grid">
          <ProjectCostAnalysis project={currentProject} />
          <BusinessImpactScorecard project={currentProject} />
        </div>

        {currentProject.hasModel && (
          <ModelPerformanceTimeSeries project={currentProject} />
        )}

        <FeedbackButton 
          pageName="Project Details" 
          onFeedbackSubmit={onFeedbackSubmit}
        />
      </div>
    );
  } catch (error) {
    console.error('Error in ProjectLevelDashboard:', error);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Error loading Project-Level Dashboard</h2>
        <p style={{ color: '#ef4444' }}>{error.message}</p>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
          Check the browser console for more details.
        </p>
      </div>
    );
  }
};

export default ProjectLevelDashboard;
