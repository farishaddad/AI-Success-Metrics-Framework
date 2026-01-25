import React, { useState } from 'react';
import { AWS_COLORS } from '../utils/chartConfig';
import Changelog from './Changelog';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  // Default credentials
  const VALID_USERNAME = 'admin';
  const VALID_PASSWORD = 'ai-metrics-2026';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        onLogin();
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="login-page">
      {showChangelog && <Changelog onClose={() => setShowChangelog(false)} />}
      
      <div className="login-background">
        <div className="login-pattern"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <img 
                src="/accenture-aws-logo.svg" 
                alt="Accenture + AWS" 
                className="logo-image"
              />
            </div>
            <h1 className="login-title">AI Success Metrics Framework</h1>
            <p className="login-subtitle">Please sign in to continue</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <p className="demo-info">
                <strong>Username:</strong> admin<br />
                <strong>Password:</strong> ai-metrics-2026
              </p>
            </div>
            
            <div className="changelog-link-container">
              <button 
                className="changelog-link" 
                onClick={() => setShowChangelog(true)}
                type="button"
              >
                📋 Changelog
                <span className="changelog-date">Last updated: Jan 23, 2026</span>
              </button>
            </div>
          </div>
        </div>

        <div className="login-info">
          <div className="info-text-section">
            <h3>Why Metrics Matter</h3>
            <p>
              Defining success through rigorous metrics is critical because it bridges the gap between 
              technical hype and sustainable business value, preventing AI initiatives from stalling at 
              the proof-of-concept stage. Despite significant global investment, approximately 95% of 
              enterprise AI projects fail to reach production, largely because they lack a practical 
              roadmap that connects technological capabilities to specific business outcomes. Establishing 
              clear success criteria ensures that every algorithm is directly linked to enterprise 
              strategy—such as reducing customer churn, lowering operational costs, or accelerating 
              product launches—rather than remaining a siloed laboratory experiment.
            </p>
          </div>
          
          <div className="info-cards-grid">
            <div className="info-card">
              <h4>Comprehensive Analytics</h4>
              <p>Track AI program performance across 9 specialized dashboards</p>
            </div>
            <div className="info-card">
              <h4>Six Dimensions</h4>
              <p>Monitor business impact, efficiency, performance, and more</p>
            </div>
            <div className="info-card">
              <h4>Executive Ready</h4>
              <p>Professional reports and insights for stakeholders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
