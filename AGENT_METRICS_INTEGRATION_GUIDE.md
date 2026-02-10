# Agent Metrics Integration Guide

## Overview

This guide explains how to integrate WeatherBot agent metrics into your AI Dashboard for real-time monitoring of performance, cost, and observability.

## What's Been Added

### 1. Agent Metrics Collection (`WeatherBot/src/middleware/metrics.py`)
- Automatic tracking of every agent invocation
- Performance metrics (response time, latency)
- Cost tracking (token usage, pricing)
- Tool usage monitoring
- Error tracking
- Session management

### 2. Backend API (`server/server.js` + `server/database/`)
- New database table: `agent_metrics`
- API endpoints for metrics:
  - `GET /api/agent-metrics` - Get all metrics
  - `GET /api/agent-metrics/session/:sessionId` - Get session metrics
  - `GET /api/agent-metrics/summary` - Get aggregated summary
  - `POST /api/agent-metrics` - Create metrics (called by agent)
  - `DELETE /api/agent-metrics/:id` - Delete metrics

### 3. Frontend Dashboard (`src/components/AgentMetricsDashboard.jsx`)
- Real-time metrics visualization
- Performance charts (invocations over time, cost trends)
- Success rate monitoring
- Token usage analysis
- Recent invocations table
- Cost breakdown
- Performance insights

## Setup Instructions

### Step 1: Update Database Schema

The database schema has been updated. Restart your backend server to apply changes:

```bash
cd server
npm start
```

The schema will be automatically applied on startup.

### Step 2: Configure WeatherBot Agent

1. **Create environment file:**
```bash
cd WeatherBot
cp .env.example .env
```

2. **Edit `.env` file:**
```bash
# Set your dashboard API URL
DASHBOARD_API_URL=http://localhost:3001/api

# Set AWS configuration
AWS_REGION=us-east-1
AWS_PROFILE=account-444
```

### Step 3: Install Python Dependencies

The agent needs the `requests` library to send metrics:

```bash
cd WeatherBot
pip3 install requests python-dotenv
```

### Step 4: Start the Agent with Metrics

```bash
cd WeatherBot
export DASHBOARD_API_URL=http://localhost:3001/api
./start_with_new_account.sh
```

Or manually:

```bash
export AWS_PROFILE=account-444
export DASHBOARD_API_URL=http://localhost:3001/api
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
```

### Step 5: Start the Dashboard

Make sure both servers are running:

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Should see: 🚀 Server running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Should see: Local: http://localhost:5173
```

**Terminal 3 - Agent:**
```bash
cd WeatherBot
./start_with_new_account.sh
# Should see: Application startup complete
```

### Step 6: Test the Integration

1. **Invoke the agent:**
```bash
cd WeatherBot
agentcore invoke --dev "Hello! What can you do?"
```

2. **View metrics in dashboard:**
   - Open browser: http://localhost:5173
   - Login to dashboard
   - Click on "🤖 Agent Metrics" tab
   - You should see the invocation metrics!

## Metrics Captured

### Performance Metrics
- **Response Time**: Total duration from request to response
- **Latency**: Average response time across invocations
- **Tool Execution Time**: Time spent in each tool call
- **Success Rate**: Percentage of successful invocations

### Cost Metrics
- **Token Usage**: Input and output tokens per invocation
- **Cost per Invocation**: Calculated based on Claude Sonnet 4.5 pricing
  - Input: $0.003 per 1K tokens
  - Output: $0.015 per 1K tokens
- **Total Cost**: Cumulative cost across all invocations
- **Cost Breakdown**: Separate tracking of input vs output costs

### Observability Metrics
- **Tool Calls**: Number and type of tools used
- **Error Rate**: Failed invocations and error types
- **Session Tracking**: Group invocations by session ID
- **Timestamps**: Start and end times for each invocation

## Dashboard Features

### Key Metrics Cards
- Total Invocations
- Total Cost
- Average Response Time
- Success Rate
- Tool Calls
- Total Tokens

### Charts
- **Invocations Over Time**: Line chart showing request volume
- **Cost Over Time**: Bar chart showing cost trends
- **Success vs Failures**: Pie chart of success rate
- **Token Distribution**: Pie chart of input vs output tokens

### Recent Invocations Table
- Timestamp
- Session ID
- Prompt preview
- Duration
- Token count
- Cost
- Tool usage
- Status (success/failed)

### Performance Insights
- Average tokens per invocation
- Performance score (based on response time)
- Cost efficiency
- Reliability score

## Troubleshooting

### Metrics Not Appearing in Dashboard

**Check 1: Backend server running?**
```bash
curl http://localhost:3001/api/health
# Should return: {"status":"ok"}
```

**Check 2: Agent can reach backend?**
```bash
curl -X POST http://localhost:3001/api/agent-metrics \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
# Should return 201 Created
```

**Check 3: Environment variable set?**
```bash
echo $DASHBOARD_API_URL
# Should show: http://localhost:3001/api
```

**Check 4: Check agent logs**
Look for warnings like:
```
Warning: Failed to send metrics to dashboard: 500
Warning: Could not send metrics to dashboard: Connection refused
```

### Database Errors

If you see database errors, reset the database:

```bash
cd server
rm database/ai-metrics.db
npm start
# Database will be recreated with new schema
```

### CORS Errors

If you see CORS errors in browser console, make sure backend CORS is configured:

```javascript
// server/server.js should have:
app.use(cors());
```

## Advanced Configuration

### Custom Metrics Collection

You can extend the metrics collector to track custom metrics:

```python
# In WeatherBot/src/middleware/metrics.py

def record_custom_metric(self, invocation_id: str, metric_name: str, value: Any):
    """Record custom metrics"""
    if invocation_id in self.session_metrics:
        if 'custom_metrics' not in self.session_metrics[invocation_id]:
            self.session_metrics[invocation_id]['custom_metrics'] = {}
        self.session_metrics[invocation_id]['custom_metrics'][metric_name] = value
```

### Filtering Metrics

Add filters to the dashboard:

```javascript
// In AgentMetricsDashboard.jsx
const [filters, setFilters] = useState({
  sessionId: '',
  success: null,
  minCost: 0,
  maxCost: 1000
});
```

### Export Metrics

Add export functionality:

```javascript
const exportMetrics = async () => {
  const data = await agentMetricsAPI.getAll();
  const csv = convertToCSV(data);
  downloadFile(csv, 'agent-metrics.csv');
};
```

## Cost Optimization Tips

### 1. Monitor Token Usage
- Track average tokens per invocation
- Identify prompts that use excessive tokens
- Optimize system prompts to reduce token count

### 2. Reduce Tool Calls
- Combine multiple tool calls when possible
- Cache tool results
- Use more efficient tools

### 3. Optimize Response Length
- Set appropriate `max_tokens` limits
- Use streaming to stop early if needed
- Avoid verbose responses

### 4. Batch Requests
- Group similar requests together
- Use session continuity to reduce context
- Implement request queuing

## Performance Optimization Tips

### 1. Reduce Latency
- Use faster models when appropriate
- Minimize tool execution time
- Implement caching for common requests

### 2. Improve Success Rate
- Add better error handling
- Implement retry logic
- Validate inputs before sending to model

### 3. Scale Efficiently
- Monitor concurrent requests
- Implement rate limiting
- Use load balancing for multiple agents

## Next Steps

1. **Set up alerts**: Configure alerts for high costs or low success rates
2. **Add more agents**: Track metrics for multiple agents
3. **Historical analysis**: Analyze trends over time
4. **Cost budgets**: Set cost limits and alerts
5. **Performance baselines**: Establish performance benchmarks

## API Reference

### POST /api/agent-metrics

Create new agent metrics entry.

**Request Body:**
```json
{
  "invocation_id": "session_123_1234567890",
  "session_id": "session_123",
  "agent_name": "WeatherBot",
  "model": "claude-sonnet-4.5",
  "prompt": "Hello!",
  "start_timestamp": "2024-01-28T10:00:00Z",
  "end_timestamp": "2024-01-28T10:00:02Z",
  "duration_ms": 2000,
  "duration_seconds": 2.0,
  "tokens_input": 100,
  "tokens_output": 200,
  "cost_usd": 0.0033,
  "response_length": 500,
  "tool_count": 2,
  "error_count": 0,
  "success": true,
  "tool_calls": [],
  "errors": []
}
```

### GET /api/agent-metrics/summary

Get aggregated metrics summary.

**Query Parameters:**
- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string

**Response:**
```json
{
  "total_invocations": 100,
  "total_cost": 0.33,
  "avg_duration_ms": 2000,
  "success_rate": "95.00",
  "total_tool_calls": 150,
  "unique_sessions": 25,
  "hourly_breakdown": [...]
}
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review agent logs for errors
3. Check backend server logs
4. Verify all services are running

## Summary

You now have a complete metrics collection and visualization system for your WeatherBot agent! The dashboard provides real-time insights into:

- ✅ Performance (response times, latency)
- ✅ Cost (token usage, pricing)
- ✅ Reliability (success rates, errors)
- ✅ Usage patterns (sessions, tool calls)

All metrics are automatically collected and displayed in your existing AI Dashboard.
