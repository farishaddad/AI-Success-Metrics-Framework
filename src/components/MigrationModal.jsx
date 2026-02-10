import React, { useState, useEffect } from 'react';
import { checkMigrationNeeded, migrateFromLocalStorage, MigrationStatus } from '../utils/migrate';
import './MigrationModal.css';

const MigrationModal = ({ onClose, onComplete }) => {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Checking for data to migrate...');
  const [results, setResults] = useState(null);

  useEffect(() => {
    checkForMigration();
  }, []);

  const checkForMigration = async () => {
    setIsChecking(true);
    try {
      const status = await checkMigrationNeeded();
      setMigrationStatus(status);
      
      if (status.status === MigrationStatus.NOT_NEEDED) {
        setMessage(status.message);
      } else if (status.status === MigrationStatus.PENDING) {
        setMessage(status.message);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    setProgress(0);
    
    try {
      const result = await migrateFromLocalStorage((progressUpdate) => {
        setProgress(progressUpdate.progress);
        setMessage(progressUpdate.message);
      });
      
      setResults(result);
      
      if (result.status === MigrationStatus.COMPLETED) {
        setTimeout(() => {
          onComplete && onComplete(result);
        }, 2000);
      }
    } catch (error) {
      setMessage(`Migration failed: ${error.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="migration-overlay">
      <div className="migration-modal">
        <div className="migration-header">
          <h2>🔄 Data Migration</h2>
          {!isMigrating && !results && (
            <button className="migration-close" onClick={handleSkip}>✕</button>
          )}
        </div>

        <div className="migration-content">
          {isChecking && (
            <div className="migration-checking">
              <div className="migration-spinner"></div>
              <p>Checking for data to migrate...</p>
            </div>
          )}

          {!isChecking && migrationStatus && migrationStatus.status === MigrationStatus.NOT_NEEDED && (
            <div className="migration-not-needed">
              <div className="migration-icon">✅</div>
              <h3>No Migration Needed</h3>
              <p>{migrationStatus.message}</p>
              <button className="migration-btn-primary" onClick={handleSkip}>
                Continue
              </button>
            </div>
          )}

          {!isChecking && migrationStatus && migrationStatus.status === MigrationStatus.PENDING && !isMigrating && !results && (
            <div className="migration-pending">
              <div className="migration-icon">📦</div>
              <h3>Data Found in Browser Storage</h3>
              <p>We found data stored in your browser that can be migrated to the database:</p>
              
              <div className="migration-stats">
                <div className="migration-stat">
                  <span className="stat-number">{migrationStatus.feedbackCount}</span>
                  <span className="stat-label">Feedback Items</span>
                </div>
                <div className="migration-stat">
                  <span className="stat-number">{migrationStatus.useCaseCount}</span>
                  <span className="stat-label">Use Cases</span>
                </div>
              </div>

              <div className="migration-info">
                <p><strong>Benefits of migrating:</strong></p>
                <ul>
                  <li>✅ Data persists even if browser cache is cleared</li>
                  <li>✅ Access data from any device</li>
                  <li>✅ Better search and filter capabilities</li>
                  <li>✅ Easy backup and restore</li>
                </ul>
              </div>

              <div className="migration-actions">
                <button className="migration-btn-secondary" onClick={handleSkip}>
                  Skip for Now
                </button>
                <button className="migration-btn-primary" onClick={handleMigrate}>
                  Migrate Data
                </button>
              </div>
            </div>
          )}

          {isMigrating && (
            <div className="migration-in-progress">
              <div className="migration-icon">⏳</div>
              <h3>Migrating Data...</h3>
              <p>{message}</p>
              
              <div className="migration-progress-bar">
                <div 
                  className="migration-progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="migration-progress-text">{progress}%</div>
            </div>
          )}

          {results && results.status === MigrationStatus.COMPLETED && (
            <div className="migration-completed">
              <div className="migration-icon success">✅</div>
              <h3>Migration Completed!</h3>
              <p>Your data has been successfully migrated to the database.</p>
              
              <div className="migration-results">
                <div className="result-item">
                  <span className="result-label">Feedback migrated:</span>
                  <span className="result-value">{results.results.feedback.count}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Use cases migrated:</span>
                  <span className="result-value">{results.results.useCases.count}</span>
                </div>
              </div>

              <div className="migration-note">
                <p>Your original data is still in browser storage as a backup.</p>
              </div>

              <button className="migration-btn-primary" onClick={() => onComplete && onComplete(results)}>
                Continue to Dashboard
              </button>
            </div>
          )}

          {results && results.status === MigrationStatus.FAILED && (
            <div className="migration-failed">
              <div className="migration-icon error">❌</div>
              <h3>Migration Had Issues</h3>
              <p>{results.message}</p>
              
              {results.results && (
                <div className="migration-errors">
                  {results.results.feedback.errors.length > 0 && (
                    <div className="error-section">
                      <p><strong>Feedback errors:</strong> {results.results.feedback.errors.length}</p>
                    </div>
                  )}
                  {results.results.useCases.errors.length > 0 && (
                    <div className="error-section">
                      <p><strong>Use case errors:</strong> {results.results.useCases.errors.length}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="migration-actions">
                <button className="migration-btn-secondary" onClick={handleSkip}>
                  Continue Anyway
                </button>
                <button className="migration-btn-primary" onClick={handleMigrate}>
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MigrationModal;
