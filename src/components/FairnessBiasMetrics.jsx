import React from 'react';
import './FairnessBiasMetrics.css';

const FairnessBiasMetrics = () => {
  const overallMetrics = {
    accuracy: 92.5,
    falsePositiveRate: 4.2,
    falseNegativeRate: 3.8
  };

  const data = [
    {
      attribute: 'Gender - Male',
      accuracy: 92.8,
      falsePositiveRate: 4.0,
      falseNegativeRate: 3.5
    },
    {
      attribute: 'Gender - Female',
      accuracy: 92.2,
      falsePositiveRate: 4.4,
      falseNegativeRate: 4.1
    },
    {
      attribute: 'Age - 18-30',
      accuracy: 93.1,
      falsePositiveRate: 3.8,
      falseNegativeRate: 3.6
    },
    {
      attribute: 'Age - 31-50',
      accuracy: 92.7,
      falsePositiveRate: 4.1,
      falseNegativeRate: 3.7
    },
    {
      attribute: 'Age - 51+',
      accuracy: 91.8,
      falsePositiveRate: 4.8,
      falseNegativeRate: 4.2
    },
    {
      attribute: 'Ethnicity - Asian',
      accuracy: 92.9,
      falsePositiveRate: 4.0,
      falseNegativeRate: 3.6
    },
    {
      attribute: 'Ethnicity - Black',
      accuracy: 91.5,
      falsePositiveRate: 5.2,
      falseNegativeRate: 4.5
    },
    {
      attribute: 'Ethnicity - Hispanic',
      accuracy: 92.3,
      falsePositiveRate: 4.3,
      falseNegativeRate: 3.9
    },
    {
      attribute: 'Ethnicity - White',
      accuracy: 92.6,
      falsePositiveRate: 4.1,
      falseNegativeRate: 3.7
    },
    {
      attribute: 'Location - Urban',
      accuracy: 93.0,
      falsePositiveRate: 3.9,
      falseNegativeRate: 3.5
    },
    {
      attribute: 'Location - Suburban',
      accuracy: 92.4,
      falsePositiveRate: 4.3,
      falseNegativeRate: 3.9
    },
    {
      attribute: 'Location - Rural',
      accuracy: 91.2,
      falsePositiveRate: 5.5,
      falseNegativeRate: 4.8
    }
  ];

  const getDeviationColor = (value, overall, metric) => {
    const deviation = Math.abs(value - overall);
    const threshold = metric === 'accuracy' ? 1.5 : 1.0;
    
    if (deviation <= threshold) return '#d1fae5'; // Green
    if (deviation <= threshold * 2) return '#fef3c7'; // Yellow
    return '#fee2e2'; // Red
  };

  const getDeviationValue = (value, overall) => {
    const deviation = value - overall;
    return deviation >= 0 ? `+${deviation.toFixed(1)}` : deviation.toFixed(1);
  };

  return (
    <div className="panel fairness-panel">
      <h2 className="panel-title">Fairness & Bias Metrics</h2>
      <div className="fairness-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#d1fae5' }}></div>
          <span>Within acceptable range</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#fef3c7' }}></div>
          <span>Moderate deviation</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#fee2e2' }}></div>
          <span>Significant deviation</span>
        </div>
      </div>
      <div className="heatmap-container">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th className="attribute-header">Protected Attribute</th>
              <th>Accuracy (%)<br/><span className="overall-value">Overall: {overallMetrics.accuracy}%</span></th>
              <th>False Positive Rate (%)<br/><span className="overall-value">Overall: {overallMetrics.falsePositiveRate}%</span></th>
              <th>False Negative Rate (%)<br/><span className="overall-value">Overall: {overallMetrics.falseNegativeRate}%</span></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="attribute-cell">{row.attribute}</td>
                <td
                  className="metric-cell"
                  style={{ background: getDeviationColor(row.accuracy, overallMetrics.accuracy, 'accuracy') }}
                >
                  <div className="cell-value">{row.accuracy}%</div>
                  <div className="cell-deviation">{getDeviationValue(row.accuracy, overallMetrics.accuracy)}</div>
                </td>
                <td
                  className="metric-cell"
                  style={{ background: getDeviationColor(row.falsePositiveRate, overallMetrics.falsePositiveRate, 'rate') }}
                >
                  <div className="cell-value">{row.falsePositiveRate}%</div>
                  <div className="cell-deviation">{getDeviationValue(row.falsePositiveRate, overallMetrics.falsePositiveRate)}</div>
                </td>
                <td
                  className="metric-cell"
                  style={{ background: getDeviationColor(row.falseNegativeRate, overallMetrics.falseNegativeRate, 'rate') }}
                >
                  <div className="cell-value">{row.falseNegativeRate}%</div>
                  <div className="cell-deviation">{getDeviationValue(row.falseNegativeRate, overallMetrics.falseNegativeRate)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FairnessBiasMetrics;
