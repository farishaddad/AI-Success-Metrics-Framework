import React, { useState } from 'react';
import './TaskLevelROI.css';

const TaskLevelROI = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'annualSavings', direction: 'desc' });

  const initialData = [
    { task: 'Document Processing', baseline: 45, aiEnabled: 8, costPerMin: 0.85 },
    { task: 'Customer Inquiry Response', baseline: 12, aiEnabled: 2, costPerMin: 0.65 },
    { task: 'Data Entry & Validation', baseline: 30, aiEnabled: 5, costPerMin: 0.55 },
    { task: 'Report Generation', baseline: 60, aiEnabled: 10, costPerMin: 0.75 },
    { task: 'Code Review', baseline: 90, aiEnabled: 25, costPerMin: 1.25 },
    { task: 'Invoice Processing', baseline: 20, aiEnabled: 4, costPerMin: 0.60 },
    { task: 'Quality Assurance Testing', baseline: 120, aiEnabled: 35, costPerMin: 0.95 },
    { task: 'Email Classification', baseline: 8, aiEnabled: 1, costPerMin: 0.45 },
    { task: 'Meeting Summarization', baseline: 25, aiEnabled: 5, costPerMin: 0.70 },
    { task: 'Contract Analysis', baseline: 180, aiEnabled: 45, costPerMin: 1.50 }
  ];

  const processedData = initialData.map(item => {
    const timeSaved = item.baseline - item.aiEnabled;
    const costSaved = timeSaved * item.costPerMin;
    const annualSavings = costSaved * 250 * 20; // 250 working days, 20 times per day avg
    return { ...item, timeSaved, costSaved, annualSavings };
  });

  const sortedData = [...processedData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  const getSavingsClass = (savings) => {
    if (savings >= 100000) return 'high';
    if (savings >= 50000) return 'medium';
    return 'low';
  };

  const totals = processedData.reduce((acc, item) => ({
    timeSaved: acc.timeSaved + item.timeSaved,
    costSaved: acc.costSaved + item.costSaved,
    annualSavings: acc.annualSavings + item.annualSavings
  }), { timeSaved: 0, costSaved: 0, annualSavings: 0 });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="sort-icon">⇅</span>;
    return <span className="sort-icon">{sortConfig.direction === 'desc' ? '↓' : '↑'}</span>;
  };

  return (
    <div className="panel task-roi-panel">
      <h2 className="panel-title">Task-Level ROI Analysis</h2>
      <div className="table-container">
        <table className="roi-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('task')}>
                Task Name <SortIcon columnKey="task" />
              </th>
              <th onClick={() => handleSort('baseline')}>
                Baseline Time (min) <SortIcon columnKey="baseline" />
              </th>
              <th onClick={() => handleSort('aiEnabled')}>
                AI-Enabled Time (min) <SortIcon columnKey="aiEnabled" />
              </th>
              <th onClick={() => handleSort('timeSaved')}>
                Time Saved (min) <SortIcon columnKey="timeSaved" />
              </th>
              <th onClick={() => handleSort('costPerMin')}>
                Cost/Min ($) <SortIcon columnKey="costPerMin" />
              </th>
              <th onClick={() => handleSort('costSaved')}>
                Cost Saved ($) <SortIcon columnKey="costSaved" />
              </th>
              <th onClick={() => handleSort('annualSavings')}>
                Annual Savings ($) <SortIcon columnKey="annualSavings" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index} className={getSavingsClass(row.annualSavings)}>
                <td className="task-name">{row.task}</td>
                <td>{row.baseline}</td>
                <td>{row.aiEnabled}</td>
                <td className="highlight">{row.timeSaved}</td>
                <td>${row.costPerMin.toFixed(2)}</td>
                <td>${row.costSaved.toFixed(2)}</td>
                <td className="savings">${row.annualSavings.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td><strong>TOTAL</strong></td>
              <td>-</td>
              <td>-</td>
              <td><strong>{totals.timeSaved.toFixed(0)}</strong></td>
              <td>-</td>
              <td><strong>${totals.costSaved.toFixed(2)}</strong></td>
              <td><strong>${totals.annualSavings.toLocaleString()}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TaskLevelROI;
