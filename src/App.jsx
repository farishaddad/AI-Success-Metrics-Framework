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
import SystemStatusDashboard from './components/SystemStatusDashboard';
import AgentMetricsDashboard from './components/AgentMetricsDashboard';
import UserManagement from './components/UserManagement';
import { feedbackAPI } from './services/api';
import { isAuthenticated as checkAuth, getUser, logout } from './services/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
  const [currentUser, setCurrentUser] = useState(getUser());
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('executive');
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const authenticated = checkAuth();
    const user = getUser();
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
    
    if (authenticated) {
      loadFeedback();
    }
  }, []);

  // Load feedback from database
  useEffect(() => {
    if (isAuthenticated) {
      loadFeedback();
    }
  }, [isAuthenticated]);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowLanding(true);
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowLanding(true);
    setActiveTab('executive');
  };

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const feedback = await feedbackAPI.getAll();
      setFeedbackItems(feedback);
    } catch (error) {
      console.error('Error loading feedback:', error);
      // Fallback to localStorage if API fails
      const savedFeedback = localStorage.getItem('userFeedback');
      if (savedFeedback) {
        setFeedbackItems(JSON.parse(savedFeedback));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedback) => {
    try {
      // Save to database
      const created = await feedbackAPI.create(feedback);
      
      // Update local state
      setFeedbackItems(prev => [...prev, created]);
      
      // Show success message
      alert('Thank you! Your suggestion has been submitted successfully.');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show landing page after authentication
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === 'admin';

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
          <div className="user-info">
            <span className="user-name">👤 {currentUser?.fullName || currentUser?.username}</span>
            <span className="user-role">({currentUser?.role})</span>
            <button className="logout-button" onClick={handleLogout} title="Logout">
              Logout
            </button>
          </div>
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
        <button
          className={`tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System Status
        </button>
        <button
          className={`tab ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          🤖 Agent Demo
        </button>
        {isAdmin && (
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 User Management
          </button>
        )}
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
      {activeTab === 'system' && <SystemStatusDashboard />}
      {activeTab === 'agent' && <AgentMetricsDashboard onFeedbackSubmit={handleFeedbackSubmit} />}
      {activeTab === 'users' && isAdmin && <UserManagement />}
    </div>
  );
}

export default App;
