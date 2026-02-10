import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { agentMetricsAPI } from '../services/api';
import FeedbackButton from './FeedbackButton';
import AgentChatInterface from './AgentChatInterface';
import './AgentMetricsDashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function AgentMetricsDashboard({ onFeedbackSubmit }) {
  const [summary, setSummary] = useState(null);
  const [recentMetrics, setRecentMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    loadMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range
      const endDate = new Date().toISOString();
      const startDate = new Date();
      
      switch(timeRange) {
        case '1h':
          startDate.setHours(startDate.getHours() - 1);
          break;
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setHours(startDate.getHours() - 24);
      }
      
      const [summaryData, metricsData] = await Promise.all([
        agentMetricsAPI.getSummary(startDate.toISOString(), endDate),
        agentMetricsAPI.getAll()
      ]);
      
      setSummary(summaryData);
      setRecentMetrics(metricsData.slice(0, 100));
    } catch (err) {
      console.error('Error loading agent metrics:', err);
      setError('Failed to load agent metrics. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="agent-metrics-dashboard">
        <div className="loading">Loading agent metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agent-metrics-dashboard">
        <div className="error-message">{error}</div>
        <button onClick={loadMetrics} className="retry-button">Retry</button>
      </div>
    );
  }

  // Handle empty state
  if (!summary || summary.total_invocations === 0) {
    return (
      <div className="agent-metrics-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>🤖 Agent Performance Metrics</h1>
            <p className="subtitle">Real-time monitoring of WeatherBot agent performance, cost, and observability</p>
          </div>
          <div className="header-controls">
            <button onClick={loadMetrics} className="refresh-button">🔄 Refresh</button>
            <FeedbackButton pageName="Agent Metrics" onSubmit={onFeedbackSubmit} />
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="chat-section">
          <AgentChatInterface 
            agentUrl="http://localhost:8081/invocations"
            onMetricsUpdate={loadMetrics}
          />
        </div>

        <div className="test-section info" style={{ 
          padding: '30px', 
          textAlign: 'center', 
          background: '#f0f8ff', 
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <h2>📊 No Metrics Data Yet</h2>
          <p>Start chatting with the agent above to generate metrics data.</p>
          <p>Or send a test request to the agent:</p>
          <pre style={{ 
            background: '#fff', 
            padding: '15px', 
            borderRadius: '4px',
            textAlign: 'left',
            overflow: 'auto'
          }}>
{`curl -X POST http://localhost:8081/invocations \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello!", "session_id": "test"}'`}
          </pre>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value || 0);
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Prepare chart data
  const hourlyData = summary?.hourly_breakdown?.map(item => ({
    time: new Date(item.hour).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    invocations: item.invocations,
    cost: parseFloat(item.cost || 0),
    avgDuration: parseFloat(item.avg_duration || 0)
  })).reverse() || [];

  const successData = [
    { name: 'Successful', value: summary?.successful_invocations || 0 },
    { name: 'Failed', value: summary?.failed_invocations || 0 }
  ];

  const tokenData = [
    { name: 'Input Tokens', value: summary?.total_input_tokens || 0 },
    { name: 'Output Tokens', value: summary?.total_output_tokens || 0 }
  ];

  return (
    <div className="agent-metrics-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>🤖 Agent Performance Metrics</h1>
          <p className="subtitle">Real-time monitoring of WeatherBot agent performance, cost, and observability</p>
        </div>
        <div className="header-controls">
          <button 
            onClick={() => setShowChat(!showChat)} 
            className={`toggle-chat-button ${showChat ? 'active' : ''}`}
          >
            {showChat ? '📊 Hide Chat' : '💬 Show Chat'}
          </button>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-range-select">
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button onClick={loadMetrics} className="refresh-button">🔄 Refresh</button>
          <FeedbackButton pageName="Agent Metrics" onSubmit={onFeedbackSubmit} />
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && (
        <div className="chat-section">
          <AgentChatInterface 
            agentUrl="http://localhost:8081/invocations"
            onMetricsUpdate={loadMetrics}
          />
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-label">Total Invocations</div>
            <div className="metric-value">{formatNumber(summary?.total_invocations)}</div>
            <div className="metric-detail">{summary?.unique_sessions} unique sessions</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">Total Cost</div>
            <div className="metric-value">{formatCurrency(summary?.total_cost)}</div>
            <div className="metric-detail">
              {formatCurrency((summary?.total_cost || 0) / (summary?.total_invocations || 1))} per invocation
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <div className="metric-label">Avg Response Time</div>
            <div className="metric-value">{formatDuration(summary?.avg_duration_ms)}</div>
            <div className="metric-detail">Average latency</div>
          </div>
        </div>

        <div className="metric-card success-rate">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-label">Success Rate</div>
            <div className="metric-value">{summary?.success_rate}%</div>
            <div className="metric-detail">
              {formatNumber(summary?.successful_invocations)} / {formatNumber(summary?.total_invocations)}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔧</div>
          <div className="metric-content">
            <div className="metric-label">Tool Calls</div>
            <div className="metric-value">{formatNumber(summary?.total_tool_calls)}</div>
            <div className="metric-detail">
              {((summary?.total_tool_calls || 0) / (summary?.total_invocations || 1)).toFixed(1)} per invocation
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-label">Total Tokens</div>
            <div className="metric-value">
              {formatNumber((summary?.total_input_tokens || 0) + (summary?.total_output_tokens || 0))}
            </div>
            <div className="metric-detail">
              {formatNumber(summary?.total_input_tokens)} in / {formatNumber(summary?.total_output_tokens)} out
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container full-width">
          <h3>📈 Invocations Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="invocations" stroke="#8884d8" name="Invocations" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container full-width">
          <h3>💵 Cost Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="cost" fill="#82ca9d" name="Cost (USD)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container half-width">
          <h3>✅ Success vs Failures</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={successData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {successData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container half-width">
          <h3>🎯 Token Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tokenData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tokenData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Invocations Table */}
      <div className="recent-invocations">
        <h3>📋 Recent Invocations</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Session ID</th>
                <th>Prompt</th>
                <th>Duration</th>
                <th>Tokens</th>
                <th>Cost</th>
                <th>Tools</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMetrics.map((metric) => (
                <tr key={metric.id} className={metric.success ? '' : 'failed'}>
                  <td>{new Date(metric.start_timestamp).toLocaleString()}</td>
                  <td className="session-id">{metric.session_id ? metric.session_id.substring(0, 8) + '...' : 'N/A'}</td>
                  <td className="prompt">{metric.prompt ? metric.prompt.substring(0, 50) + '...' : 'N/A'}</td>
                  <td>{formatDuration(metric.duration_ms || 0)}</td>
                  <td>{formatNumber((metric.tokens_input || 0) + (metric.tokens_output || 0))}</td>
                  <td>{formatCurrency(metric.cost_usd || 0)}</td>
                  <td>{metric.tool_count || 0}</td>
                  <td>
                    <span className={`status-badge ${metric.success ? 'success' : 'failed'}`}>
                      {metric.success ? '✅ Success' : '❌ Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="cost-breakdown">
        <h3>💰 Cost Breakdown</h3>
        <div className="cost-details">
          <div className="cost-item">
            <span className="cost-label">Input Tokens Cost:</span>
            <span className="cost-value">{formatCurrency(summary?.total_cost * (summary?.total_input_tokens / ((summary?.total_input_tokens || 0) + (summary?.total_output_tokens || 1))))}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Output Tokens Cost:</span>
            <span className="cost-value">{formatCurrency(summary?.total_cost * (summary?.total_output_tokens / ((summary?.total_input_tokens || 1) + (summary?.total_output_tokens || 0))))}</span>
          </div>
          <div className="cost-item total">
            <span className="cost-label">Total Cost:</span>
            <span className="cost-value">{formatCurrency(summary?.total_cost)}</span>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="insights-section">
        <h3>💡 Performance Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Average Tokens per Invocation</h4>
              <p className="insight-value">
                {formatNumber(summary?.avg_input_tokens + summary?.avg_output_tokens)}
              </p>
              <p className="insight-detail">
                {formatNumber(summary?.avg_input_tokens)} input + {formatNumber(summary?.avg_output_tokens)} output
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Performance Score</h4>
              <p className="insight-value">
                {summary?.avg_duration_ms < 2000 ? '🟢 Excellent' : summary?.avg_duration_ms < 5000 ? '🟡 Good' : '🔴 Needs Improvement'}
              </p>
              <p className="insight-detail">Based on average response time</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">💵</div>
            <div className="insight-content">
              <h4>Cost Efficiency</h4>
              <p className="insight-value">
                {formatCurrency((summary?.total_cost || 0) / (summary?.total_invocations || 1))}
              </p>
              <p className="insight-detail">Average cost per invocation</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Reliability</h4>
              <p className="insight-value">
                {parseFloat(summary?.success_rate) > 95 ? '🟢 Excellent' : parseFloat(summary?.success_rate) > 90 ? '🟡 Good' : '🔴 Needs Attention'}
              </p>
              <p className="insight-detail">{summary?.success_rate}% success rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentMetricsDashboard;
