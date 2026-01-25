import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import BusinessImpactDashboard from './components/BusinessImpactDashboard';
import OperationalEfficiencyDashboard from './components/OperationalEfficiencyDashboard';
import ModelPerformanceDashboard from './components/ModelPerformanceDashboard';
import CustomerExperienceDashboard from './components/CustomerExperienceDashboard';
import InnovationCapacityDashboard from './components/InnovationCapacityDashboard';
import EconomicEfficiencyDashboard from './components/EconomicEfficiencyDashboard';
import ROITrackingDashboard from './components/ROITrackingDashboard';
import ProjectLevelDashboard from './components/ProjectLevelDashboard';
import UseCaseRegistry from './components/UseCaseRegistry';
import FeedbackList from './components/FeedbackList';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('executive');
  const [feedbackItems, setFeedbackItems] = useState([]);

  // Load feedback from localStorage on mount
  useEffect(() => {
    const savedFeedback = localStorage.getItem('userFeedback');
    if (savedFeedback) {
      setFeedbackItems(JSON.parse(savedFeedback));
    }
  }, []);

  // Save feedback to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userFeedback', JSON.stringify(feedbackItems));
  }, [feedbackItems]);

  const handleFeedbackSubmit = (feedback) => {
    console.log('Submitting feedback:', feedback);
    setFeedbackItems(prev => {
      const updated = [...prev, feedback];
      console.log('Updated feedback items:', updated);
      return updated;
    });
    // Show success message
    alert('Thank you! Your suggestion has been submitted successfully.');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Show landing page after authentication
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Show main dashboard
  return (
    <div className="app">
      <div className="app-header">
        <div className="header-content">
          <button 
            className="back-to-landing"
            onClick={() => setShowLanding(true)}
            title="Back to landing page"
          >
            ← AI Success Metrics Framework
          </button>
        </div>
      </div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'executive' ? 'active' : ''}`}
          onClick={() => setActiveTab('executive')}
        >
          Executive Overview
        </button>
        <button
          className={`tab ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          Business Impact
        </button>
        <button
          className={`tab ${activeTab === 'operational' ? 'active' : ''}`}
          onClick={() => setActiveTab('operational')}
        >
          Operational Efficiency
        </button>
        <button
          className={`tab ${activeTab === 'model' ? 'active' : ''}`}
          onClick={() => setActiveTab('model')}
        >
          Model Performance
        </button>
        <button
          className={`tab ${activeTab === 'customer' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer')}
        >
          Customer Experience
        </button>
        <button
          className={`tab ${activeTab === 'innovation' ? 'active' : ''}`}
          onClick={() => setActiveTab('innovation')}
        >
          Innovation Capacity
        </button>
        <button
          className={`tab ${activeTab === 'economic' ? 'active' : ''}`}
          onClick={() => setActiveTab('economic')}
        >
          Economic Efficiency
        </button>
        <button
          className={`tab ${activeTab === 'roi' ? 'active' : ''}`}
          onClick={() => setActiveTab('roi')}
        >
          ROI Tracking
        </button>
        <button
          className={`tab ${activeTab === 'project' ? 'active' : ''}`}
          onClick={() => setActiveTab('project')}
        >
          Project Details
        </button>
        <button
          className={`tab ${activeTab === 'usecase' ? 'active' : ''}`}
          onClick={() => setActiveTab('usecase')}
        >
          Use Case Registry
        </button>
        <button
          className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          User Suggestions
        </button>
      </div>
      {activeTab === 'executive' && <Dashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'business' && <BusinessImpactDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'operational' && <OperationalEfficiencyDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'model' && <ModelPerformanceDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'customer' && <CustomerExperienceDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'innovation' && <InnovationCapacityDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'economic' && <EconomicEfficiencyDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'roi' && <ROITrackingDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'project' && <ProjectLevelDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'usecase' && <UseCaseRegistry onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'feedback' && <FeedbackList key={feedbackItems.length} feedbackItems={feedbackItems} />}
    </div>
  );
}

export default App;
