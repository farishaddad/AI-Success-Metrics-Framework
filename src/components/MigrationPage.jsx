import React, { useState } from 'react';
import MigrationModal from './MigrationModal';
import './MigrationPage.css';

const MigrationPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [results, setResults] = useState(null);

  const handleComplete = (migrationResults) => {
    setResults(migrationResults);
    setMigrationComplete(true);
    setShowModal(false);
  };

  return (
    <div className="migration-page">
      <div className="migration-page-container">
        <div className="migration-page-header">
          <h1>🔄 Data Migration Tool</h1>
          <p>Migrate your data from browser storage to the database</p>
        </div>

        {!migrationComplete ? (
          <div className="migration-page-content">
            <div className="migration-info-card">
              <h2>Why Migrate?</h2>
              <ul>
                <li>✅ <strong>Persistent Storage:</strong> Data survives browser cache clears</li>
                <li>✅ <strong>Cross-Device Access:</strong> Access your data from any device</li>
                <li>✅ <strong>Better Performance:</strong> Faster search and filtering</li>
                <li>✅ <strong>Easy Backup:</strong> Simple database file backup</li>
                <li>✅ <strong>Scalability:</strong> Handle unlimited data</li>
              </ul>
            </div>

            <div className="migration-info-card">
              <h2>What Gets Migrated?</h2>
              <ul>
                <li>📝 All feedback and suggestions</li>
                <li>📊 Use case registry entries</li>
                <li>📈 KPI tables and metrics</li>
                <li>⚠️ Risk assessments</li>
                <li>👥 Stakeholder information</li>
                <li>📅 Project milestones</li>
              </ul>
            </div>

            <div className="migration-info-card">
              <h2>Is It Safe?</h2>
              <p>
                Yes! Your original data remains in browser storage as a backup. 
                The migration process only copies data to the database without 
                deleting the original.
              </p>
            </div>

            <button 
              className="migration-start-btn"
              onClick={() => setShowModal(true)}
            >
              Start Migration
            </button>
          </div>
        ) : (
          <div className="migration-page-content">
            <div className="migration-success-card">
              <div className="success-icon">✅</div>
              <h2>Migration Complete!</h2>
              <p>Your data has been successfully migrated to the database.</p>
              
              {results && results.results && (
                <div className="migration-summary">
                  <div className="summary-item">
                    <span className="summary-label">Feedback Items:</span>
                    <span className="summary-value">{results.results.feedback.count}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Use Cases:</span>
                    <span className="summary-value">{results.results.useCases.count}</span>
                  </div>
                </div>
              )}

              <div className="migration-next-steps">
                <h3>Next Steps:</h3>
                <ol>
                  <li>Your data is now stored in the database</li>
                  <li>Original data remains in browser storage as backup</li>
                  <li>You can now access your data from any device</li>
                  <li>Database file: <code>server/database/ai-metrics.db</code></li>
                </ol>
              </div>

              <button 
                className="migration-start-btn"
                onClick={() => window.location.href = '/'}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <MigrationModal
          onClose={() => setShowModal(false)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default MigrationPage;
