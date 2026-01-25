import React from 'react';
import './ProjectLifecycle.css';

const ProjectLifecycle = ({ project }) => {
  try {
    if (!project) {
      return <div>No project data</div>;
    }

    const phases = [
      {
        name: 'Planning',
        duration: '2 months',
        cost: '$45K',
        status: 'completed',
        milestones: ['Requirements', 'Design', 'Approval']
      },
      {
        name: 'Development',
        duration: '4 months',
        cost: '$180K',
        status: 'completed',
        milestones: ['MVP', 'Testing', 'Integration']
      },
      {
        name: 'Pilot',
        duration: '2 months',
        cost: '$65K',
        status: 'completed',
        milestones: ['Beta Launch', 'Feedback', 'Refinement']
      },
      {
        name: 'Production',
        duration: '3 months',
        cost: '$120K',
        status: project.status === 'Production' || project.status === 'Optimization' ? 'current' : 'pending',
        milestones: ['Full Launch', 'Monitoring', 'Support']
      },
      {
        name: 'Optimization',
        duration: 'Ongoing',
        cost: '$40K',
        status: project.status === 'Optimization' ? 'current' : 'pending',
        milestones: ['Performance Tuning', 'Feature Enhancement', 'Scaling']
      }
    ];

    const getPhaseClass = (status) => {
      switch (status) {
        case 'completed': return 'phase-completed';
        case 'current': return 'phase-current';
        case 'pending': return 'phase-pending';
        default: return '';
      }
    };

    return (
      <div className="panel project-lifecycle-panel">
        <h2 className="panel-title">Project Lifecycle</h2>
        <div className="timeline-container">
          {phases.map((phase, index) => (
            <div key={index} className={`timeline-phase ${getPhaseClass(phase.status)}`}>
              <div className="phase-header">
                <div className="phase-indicator">
                  {phase.status === 'completed' && <span className="phase-icon">✓</span>}
                  {phase.status === 'current' && <span className="phase-icon current">●</span>}
                  {phase.status === 'pending' && <span className="phase-icon">○</span>}
                </div>
                <div className="phase-info">
                  <h3 className="phase-name">{phase.name}</h3>
                  <div className="phase-meta">
                    <span className="phase-duration">{phase.duration}</span>
                    <span className="phase-cost">{phase.cost}</span>
                  </div>
                </div>
              </div>
              <div className="phase-milestones">
                {phase.milestones.map((milestone, idx) => (
                  <span key={idx} className="milestone-tag">
                    {milestone}
                  </span>
                ))}
              </div>
              {index < phases.length - 1 && <div className="phase-connector"></div>}
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ProjectLifecycle:', error);
    return <div style={{ padding: '20px', color: '#ef4444' }}>Error loading lifecycle: {error.message}</div>;
  }
};

export default ProjectLifecycle;
