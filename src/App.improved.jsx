import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { storage, STORAGE_KEYS } from './utils/storage';
import { TABS, DEFAULT_TAB } from './constants/tabs';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import './App.css';

// Lazy load dashboard components for better performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const BusinessImpactDashboard = lazy(() => import('./components/BusinessImpactDashboard'));
const OperationalEfficiencyDashboard = lazy(() => import('./components/OperationalEfficiencyDashboard'));
const ModelPerformanceDashboard = lazy(() => import('./components/ModelPerformanceDashboard'));
const CustomerExperienceDashboard = lazy(() => import('./components/CustomerExperienceDashboard'));
const InnovationCapacityDashboard = lazy(() => import('./components/InnovationCapacityDashboard'));
const EconomicEfficiencyDashboard = lazy(() => import('./components/EconomicEfficiencyDashboard'));
const ROITrackingDashboard = lazy(() => import('./components/ROITrackingDashboard'));
const ProjectLevelDashboard = lazy(() => import('./components/ProjectLevelDashboard'));
const UseCaseRegistry = lazy(() => import('./components/UseCaseRegistry'));
const FeedbackList = lazy(() => import('./components/FeedbackList'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '400px',
    color: 'var(--aws-primary)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        border: '4px solid var(--aws-bg-secondary)',
        borderTop: '4px solid var(--aws-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <p>Loading dashboard...</p>
    </div>
  </div>
);

// Component map for dynamic rendering
const DASHBOARD_COMPONENTS = {
  executive: Dashboard,
  business: BusinessImpactDashboard,
  operational: OperationalEfficiencyDashboard,
  model: ModelPerformanceDashboard,
  customer: CustomerExperienceDashboard,
  innovation: InnovationCapacityDashboard,
  economic: EconomicEfficiencyDashboard,
  roi: ROITrackingDashboard,
  project: ProjectLevelDashboard,
  usecase: UseCaseRegistry,
  feedback: FeedbackList,
};

function AppContent() {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [feedbackItems, setFeedbackItems] = useState([]);

  // Load feedback from localStorage on mount
  useEffect(() => {
    const savedFeedback = storage.getItem(STORAGE_KEYS.USER_FEEDBACK, []);
    setFeedbackItems(savedFeedback);
  }, []);

  // Save feedback to localStorage whenever it changes
  useEffect(() => {
    if (feedbackItems.length > 0) {
      const success = storage.setItem(STORAGE_KEYS.USER_FEEDBACK, feedbackItems);
      if (!success) {
        showToast('Failed to save feedback. Storage may be full.', 'error');
      }
    }
  }, [feedbackItems, showToast]);

  const handleFeedbackSubmit = useCallback((feedback) => {
    setFeedbackItems(prev => [...prev, feedback]);
    showToast('Thank you! Your suggestion has been submitted successfully.', 'success');
  }, [showToast]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    storage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
  }, []);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Show landing page after authentication
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Get active dashboard component
  const ActiveDashboard = DASHBOARD_COMPONENTS[activeTab];

  // Show main dashboard
  return (
    <div className="app">
      <div className="app-header">
        <div className="header-content">
          <button 
            className="back-to-landing"
            onClick={() => setShowLanding(true)}
            title="Back to landing page"
            aria-label="Back to landing page"
          >
            ← AI Success Metrics Framework
          </button>
        </div>
      </div>

      <nav className="tabs" role="tablist" aria-label="Dashboard navigation">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div 
        id={`${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === 'feedback' ? (
            <ActiveDashboard feedbackItems={feedbackItems} />
          ) : (
            <ActiveDashboard onFeedbackSubmit={handleFeedbackSubmit} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
