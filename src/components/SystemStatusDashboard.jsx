import React, { useState, useEffect } from 'react';
import './SystemStatusDashboard.css';

const SystemStatusDashboard = () => {
  const [backendStatus, setBackendStatus] = useState({
    status: 'checking',
    responseTime: null,
    lastCheck: null
  });
  
  const [frontendMetrics, setFrontendMetrics] = useState({
    loadTime: null,
    memoryUsage: null,
    connectionType: null
  });

  const [apiMetrics, setApiMetrics] = useState({
    totalRequests: 0,
    successRate: 100,
    avgResponseTime: 0,
    errors: []
  });

  const [databaseInfo, setDatabaseInfo] = useState({
    feedbackCount: 0,
    useCasesCount: 0,
    lastUpdate: null
  });

  // Check backend health
  const checkBackendHealth = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      const endTime = performance.now();
      const data = await response.json();
      
      setBackendStatus({
        status: response.ok ? 'online' : 'error',
        responseTime: Math.round(endTime - startTime),
        lastCheck: new Date().toISOString(),
        message: data.message
      });
    } catch (error) {
      setBackendStatus({
        status: 'offline',
        responseTime: null,
        lastCheck: new Date().toISOString(),
        error: error.message
      });
    }
  };

  // Get database stats
  const getDatabaseStats = async () => {
    try {
      const [feedbackRes, useCasesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/feedback`),
        fetch(`${import.meta.env.VITE_API_URL}/usecases`)
      ]);
      
      const feedback = await feedbackRes.json();
      const useCases = await useCasesRes.json();
      
      setDatabaseInfo({
        feedbackCount: feedback.length,
        useCasesCount: useCases.length,
        lastUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching database stats:', error);
    }
  };

  // Get frontend performance metrics
  const getFrontendMetrics = () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const memory = performance.memory;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    setFrontendMetrics({
      loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : null,
      memoryUsage: memory ? {
        used: (memory.usedJSHeapSize / 1048576).toFixed(2),
        total: (memory.totalJSHeapSize / 1048576).toFixed(2),
        limit: (memory.jsHeapSizeLimit / 1048576).toFixed(2)
      } : null,
      connectionType: connection ? connection.effectiveType : 'unknown'
    });
  };

  // Initialize and set up polling
  useEffect(() => {
    checkBackendHealth();
    getDatabaseStats();
    getFrontendMetrics();

    // Poll backend every 10 seconds
    const healthInterval = setInterval(checkBackendHealth, 10000);
    
    // Update database stats every 30 seconds
    const dbInterval = setInterval(getDatabaseStats, 30000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(dbInterval);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#1D8102';
      case 'offline': return '#D13212';
      case 'checking': return '#FF9900';
      default: return '#687078';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '✓';
      case 'offline': return '✕';
      case 'checking': return '⟳';
      default: return '?';
    }
  };

  return (
    <div className="system-status-dashboard">
      <div className="status-header">
        <h1>System Status & Performance</h1>
        <p className="status-subtitle">Real-time monitoring of application health and metrics</p>
      </div>

      {/* Server Status Cards */}
      <div className="status-grid">
        {/* Backend Status */}
        <div className="status-card">
          <div className="status-card-header">
            <h3>Backend Server</h3>
            <span 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(backendStatus.status) }}
            >
              {getStatusIcon(backendStatus.status)}
            </span>
          </div>
          <div className="status-card-body">
            <div className="status-metric">
              <span className="metric-label">Status:</span>
              <span className="metric-value" style={{ color: getStatusColor(backendStatus.status) }}>
                {backendStatus.status.toUpperCase()}
              </span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Response Time:</span>
              <span className="metric-value">
                {backendStatus.responseTime ? `${backendStatus.responseTime}ms` : 'N/A'}
              </span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Endpoint:</span>
              <span className="metric-value endpoint">{import.meta.env.VITE_API_URL}</span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Last Check:</span>
              <span className="metric-value">
                {backendStatus.lastCheck ? new Date(backendStatus.lastCheck).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
          <button className="refresh-btn" onClick={checkBackendHealth}>
            ⟳ Refresh
          </button>
        </div>

        {/* Frontend Status */}
        <div className="status-card">
          <div className="status-card-header">
            <h3>Frontend Application</h3>
            <span className="status-indicator" style={{ backgroundColor: '#1D8102' }}>✓</span>
          </div>
          <div className="status-card-body">
            <div className="status-metric">
              <span className="metric-label">Status:</span>
              <span className="metric-value" style={{ color: '#1D8102' }}>ONLINE</span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Load Time:</span>
              <span className="metric-value">
                {frontendMetrics.loadTime ? `${frontendMetrics.loadTime}ms` : 'N/A'}
              </span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Connection:</span>
              <span className="metric-value">{frontendMetrics.connectionType}</span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Port:</span>
              <span className="metric-value">3000</span>
            </div>
          </div>
          <button className="refresh-btn" onClick={getFrontendMetrics}>
            ⟳ Refresh
          </button>
        </div>

        {/* Database Status */}
        <div className="status-card">
          <div className="status-card-header">
            <h3>Database</h3>
            <span 
              className="status-indicator" 
              style={{ backgroundColor: backendStatus.status === 'online' ? '#1D8102' : '#D13212' }}
            >
              {backendStatus.status === 'online' ? '✓' : '✕'}
            </span>
          </div>
          <div className="status-card-body">
            <div className="status-metric">
              <span className="metric-label">Type:</span>
              <span className="metric-value">JSON (lowdb)</span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Feedback Items:</span>
              <span className="metric-value">{databaseInfo.feedbackCount}</span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Use Cases:</span>
              <span className="metric-value">{databaseInfo.useCasesCount}</span>
            </div>
            <div className="status-metric">
              <span className="metric-label">Location:</span>
              <span className="metric-value endpoint">server/database/db.json</span>
            </div>
          </div>
          <button className="refresh-btn" onClick={getDatabaseStats}>
            ⟳ Refresh
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h2>Performance Metrics</h2>
        
        <div className="metrics-grid">
          {/* Memory Usage */}
          {frontendMetrics.memoryUsage && (
            <div className="metric-card">
              <h3>Memory Usage</h3>
              <div className="metric-chart">
                <div className="memory-bar">
                  <div 
                    className="memory-used"
                    style={{ 
                      width: `${(frontendMetrics.memoryUsage.used / frontendMetrics.memoryUsage.limit * 100)}%`,
                      backgroundColor: frontendMetrics.memoryUsage.used / frontendMetrics.memoryUsage.limit > 0.8 ? '#D13212' : '#0073BB'
                    }}
                  />
                </div>
                <div className="memory-stats">
                  <div className="memory-stat">
                    <span>Used:</span>
                    <strong>{frontendMetrics.memoryUsage.used} MB</strong>
                  </div>
                  <div className="memory-stat">
                    <span>Total:</span>
                    <strong>{frontendMetrics.memoryUsage.total} MB</strong>
                  </div>
                  <div className="memory-stat">
                    <span>Limit:</span>
                    <strong>{frontendMetrics.memoryUsage.limit} MB</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Response Time */}
          <div className="metric-card">
            <h3>API Response Time</h3>
            <div className="metric-display">
              <div className="metric-value-large">
                {backendStatus.responseTime || 0}
                <span className="metric-unit">ms</span>
              </div>
              <div className="metric-status">
                {backendStatus.responseTime < 100 ? (
                  <span style={{ color: '#1D8102' }}>✓ Excellent</span>
                ) : backendStatus.responseTime < 300 ? (
                  <span style={{ color: '#FF9900' }}>⚠ Good</span>
                ) : (
                  <span style={{ color: '#D13212' }}>✕ Slow</span>
                )}
              </div>
            </div>
          </div>

          {/* Data Storage */}
          <div className="metric-card">
            <h3>Data Storage</h3>
            <div className="storage-stats">
              <div className="storage-item">
                <div className="storage-icon">📝</div>
                <div className="storage-info">
                  <div className="storage-count">{databaseInfo.feedbackCount}</div>
                  <div className="storage-label">Feedback Items</div>
                </div>
              </div>
              <div className="storage-item">
                <div className="storage-icon">📊</div>
                <div className="storage-info">
                  <div className="storage-count">{databaseInfo.useCasesCount}</div>
                  <div className="storage-label">Use Cases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="system-info-section">
        <h2>System Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Browser:</span>
            <span className="info-value">{navigator.userAgent.split(' ').pop()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Platform:</span>
            <span className="info-value">{navigator.platform}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Language:</span>
            <span className="info-value">{navigator.language}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Online:</span>
            <span className="info-value">{navigator.onLine ? 'Yes' : 'No'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Screen Resolution:</span>
            <span className="info-value">{window.screen.width} × {window.screen.height}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Viewport:</span>
            <span className="info-value">{window.innerWidth} × {window.innerHeight}</span>
          </div>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="auto-refresh-info">
        <span className="refresh-icon">⟳</span>
        Auto-refreshing: Backend health every 10s, Database stats every 30s
      </div>
    </div>
  );
};

export default SystemStatusDashboard;
