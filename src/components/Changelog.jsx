import React from 'react';
import './Changelog.css';

const Changelog = ({ onClose }) => {
  const changes = [
    {
      version: '1.6.0',
      date: '2026-01-23',
      title: 'User Feedback System & UI Improvements',
      items: [
        'Added comprehensive user feedback system across all dashboards',
        'Created floating "Suggest Changes" button on every dashboard page',
        'Added User Suggestions tab (11th tab) with full feedback management',
        'Implemented feedback list with search and filter capabilities',
        'Added localStorage persistence for all user suggestions',
        'Replaced login page icon with Accenture + AWS logo',
        'Fixed changelog link hover effects for better stability',
        'Added success notifications for feedback submissions',
        'Implemented automatic page name and date capture in feedback forms'
      ]
    },
    {
      version: '1.5.0',
      date: '2026-01-23',
      title: 'Use Case Registry & Comprehensive Forms',
      items: [
        'Added Use Case Registry dashboard (10th tab)',
        'Created comprehensive 12-section tabbed form for use case documentation',
        'Added KPI tracking table with 5 pre-populated categories',
        'Added Data Requirements table with quality level tracking',
        'Added Risk Assessment table with 4 risk categories',
        'Added Timeline & Milestones table with 6 project phases',
        'Added Stakeholders table with 6 key roles',
        'Integrated all tables with AWS Design System styling'
      ]
    },
    {
      version: '1.4.0',
      date: '2026-01-23',
      title: 'Data Governance Framework',
      items: [
        'Added comprehensive Data Governance Framework section to landing page',
        'Integrated Agentic AI data sources (AgentCore, Strands, LangGraph, MCP)',
        'Added Observability Stack (Grafana, CloudWatch, X-Ray, Bedrock)',
        'Created 12-month implementation roadmap',
        'Added risk assessment and compliance tracking'
      ]
    },
    {
      version: '1.3.0',
      date: '2026-01-23',
      title: 'Multi-Dimensional Metrics & Architecture',
      items: [
        'Added Multi-Dimensional Metrics section with 4 categories',
        'Created interactive architecture diagram with 5 layers',
        'Added visual component hierarchy display',
        'Implemented responsive architecture visualization',
        'Updated to reflect 10 dashboard system'
      ]
    },
    {
      version: '1.2.0',
      date: '2025-12-15',
      title: 'Framework Importance & Infographic',
      items: [
        'Added "Why a Robust Measurement Framework is Essential" section',
        'Integrated AI Value Roadmap infographic support',
        'Added framework explanation with Trending ROI vs Realized ROI',
        'Included LCOAI metrics explanation',
        'Added governance and data quality importance'
      ]
    },
    {
      version: '1.1.0',
      date: '2025-11-20',
      title: 'Landing Page & Authentication',
      items: [
        'Created comprehensive landing page with framework story',
        'Added login authentication (username: admin, password: ai-metrics-2026)',
        'Implemented dashboard architecture overview',
        'Added 4-pillar ROI view explanation',
        'Created footer with creator information'
      ]
    },
    {
      version: '1.0.0',
      date: '2025-09-15',
      title: 'Initial Release - 9 Dashboard System',
      items: [
        'Executive Overview Dashboard with KPI cards',
        'Business Impact Dashboard with revenue attribution',
        'Operational Efficiency Dashboard with process metrics',
        'Model Performance Dashboard with incident tracking',
        'Customer Experience Dashboard with CSAT/NPS',
        'Innovation Capacity Dashboard with upskilling metrics',
        'Economic Efficiency Dashboard with cost breakdown',
        'ROI Tracking Dashboard with 4-pillar view',
        'Project Level Dashboard with lifecycle tracking',
        'Applied AWS Design System colors throughout',
        'Implemented responsive design for all dashboards'
      ]
    }
  ];

  return (
    <div className="changelog-overlay" onClick={onClose}>
      <div className="changelog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-header">
          <h2>📋 Changelog</h2>
          <button className="changelog-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="changelog-content">
          {changes.map((change, index) => (
            <div key={index} className="changelog-entry">
              <div className="changelog-entry-header">
                <div className="changelog-version">
                  <span className="version-badge">v{change.version}</span>
                  <span className="version-date">{change.date}</span>
                </div>
                <h3 className="changelog-title">{change.title}</h3>
              </div>
              <ul className="changelog-items">
                {change.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="changelog-footer">
          <p>AI Success Metrics Framework • Built by Faris Haddad</p>
        </div>
      </div>
    </div>
  );
};

export default Changelog;
