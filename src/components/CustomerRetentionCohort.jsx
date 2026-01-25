import React from 'react';
import './CustomerRetentionCohort.css';

const CustomerRetentionCohort = () => {
  const cohorts = [
    { month: 'Jan 2025', m0: 100, m1: 92, m2: 87, m3: 84, m4: 81, m5: 79, aiEngaged: true },
    { month: 'Feb 2025', m0: 100, m1: 91, m2: 86, m3: 83, m4: 80, m5: null, aiEngaged: true },
    { month: 'Mar 2025', m0: 100, m1: 93, m2: 88, m3: 85, m4: null, m5: null, aiEngaged: true },
    { month: 'Apr 2025', m0: 100, m1: 90, m2: 85, m3: null, m4: null, m5: null, aiEngaged: false },
    { month: 'May 2025', m0: 100, m1: 89, m2: null, m3: null, m4: null, m5: null, aiEngaged: false },
    { month: 'Jun 2025', m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null, aiEngaged: false }
  ];

  const getColor = (value) => {
    if (value === null) return '#f3f4f6';
    if (value >= 90) return '#d1fae5';
    if (value >= 85) return '#a7f3d0';
    if (value >= 80) return '#6ee7b7';
    if (value >= 75) return '#fef3c7';
    return '#fee2e2';
  };

  const getTextColor = (value) => {
    if (value === null) return '#9ca3af';
    if (value >= 80) return '#065f46';
    if (value >= 75) return '#92400e';
    return '#991b1b';
  };

  return (
    <div className="panel cohort-panel">
      <h2 className="panel-title">Customer Retention Cohort</h2>
      <div className="cohort-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#d1fae5' }}></div>
          <span>≥90%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#a7f3d0' }}></div>
          <span>85-89%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#6ee7b7' }}></div>
          <span>80-84%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#fef3c7' }}></div>
          <span>75-79%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#fee2e2' }}></div>
          <span>&lt;75%</span>
        </div>
      </div>
      <div className="cohort-container">
        <table className="cohort-table">
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Type</th>
              <th>M0</th>
              <th>M1</th>
              <th>M2</th>
              <th>M3</th>
              <th>M4</th>
              <th>M5</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort, index) => (
              <tr key={index}>
                <td className="cohort-month">{cohort.month}</td>
                <td className="cohort-type">
                  <span className={`type-badge ${cohort.aiEngaged ? 'ai-engaged' : 'non-engaged'}`}>
                    {cohort.aiEngaged ? 'AI-Engaged' : 'Non-Engaged'}
                  </span>
                </td>
                <td
                  className="cohort-cell"
                  style={{
                    background: getColor(cohort.m0),
                    color: getTextColor(cohort.m0)
                  }}
                >
                  {cohort.m0 !== null ? `${cohort.m0}%` : '-'}
                </td>
                <td
                  className="cohort-cell"
                  style={{
                    background: getColor(cohort.m1),
                    color: getTextColor(cohort.m1)
                  }}
                >
                  {cohort.m1 !== null ? `${cohort.m1}%` : '-'}
                </td>
                <td
                  className="cohort-cell"
                  style={{
                    background: getColor(cohort.m2),
                    color: getTextColor(cohort.m2)
                  }}
                >
                  {cohort.m2 !== null ? `${cohort.m2}%` : '-'}
                </td>
                <td
                  className="cohort-cell"
                  style={{
                    background: getColor(cohort.m3),
                    color: getTextColor(cohort.m3)
                  }}
                >
                  {cohort.m3 !== null ? `${cohort.m3}%` : '-'}
                </td>
                <td
                  className="cohort-cell"
                  style={{
                    background: getColor(cohort.m4),
                    color: getTextColor(cohort.m4)
                  }}
                >
                  {cohort.m4 !== null ? `${cohort.m4}%` : '-'}
                </td>
                <td
                  className="cohort-cell"
                  style={{
                    background: getColor(cohort.m5),
                    color: getTextColor(cohort.m5)
                  }}
                >
                  {cohort.m5 !== null ? `${cohort.m5}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerRetentionCohort;
