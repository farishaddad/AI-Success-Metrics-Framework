import React from 'react';
import './ProjectSelector.css';

const ProjectSelector = ({ projects, selectedProject, onSelectProject }) => {
  try {
    const project = projects[selectedProject];

    if (!project) {
      return <div>Project not found</div>;
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'Production': return '#10b981';
        case 'Optimization': return '#3b82f6';
        case 'Pilot': return '#f59e0b';
        case 'Development': return '#8b5cf6';
        default: return '#6b7280';
      }
    };

    return (
      <div className="project-selector-container">
        <div className="selector-header">
          <h2 className="selector-title">Project Details</h2>
          <select
            className="project-dropdown"
            value={selectedProject}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {Object.values(projects).map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-label">Status</span>
            <span
              className="stat-value status-badge"
              style={{ background: getStatusColor(project.status), color: 'white' }}
            >
              {project.status}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Owner</span>
            <span className="stat-value">{project.owner}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Start Date</span>
            <span className="stat-value">{new Date(project.startDate).toLocaleDateString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Budget</span>
            <span className="stat-value">${(project.budget / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ProjectSelector:', error);
    return <div style={{ padding: '20px', color: '#ef4444' }}>Error loading project selector: {error.message}</div>;
  }
};

export default ProjectSelector;
