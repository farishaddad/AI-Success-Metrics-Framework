# Agent Metrics - Quick Start

## What's New

Your AI Dashboard now tracks WeatherBot agent metrics in real-time! 🎉

## Quick Setup (5 minutes)

### 1. Restart Backend Server

```bash
cd server
npm start
```

This applies the new database schema for agent metrics.

### 2. Configure Agent

```bash
cd WeatherBot
cp .env.example .env
# Edit .env and set:
# DASHBOARD_API_URL=http://localhost:3001/api
```

### 3. Install Python Dependency

```bash
cd WeatherBot
pip3 install requests
```

### 4. Start Agent with Metrics

```bash
cd WeatherBot
export DASHBOARD_API_URL=http://localhost:3001/api
./start_with_new_account.sh
```

### 5. Test It

```bash
# Invoke the agent
agentcore invoke --dev "Hello! What can you do?"

# Open dashboard
# Go to: http://localhost:5173
# Click: "🤖 Agent Metrics" tab
# See your metrics! 📊
```

## What You'll See

### Metrics Dashboard Shows:
- 📊 **Total Invocations** - How many times the agent was called
- 💰 **Total Cost** - Cost in USD (based on token usage)
- ⚡ **Avg Response Time** - How fast the agent responds
- ✅ **Success Rate** - Percentage of successful calls
- 🔧 **Tool Calls** - Number of tools used
- 🎯 **Token Usage** - Input and output tokens

### Charts:
- Invocations over time
- Cost trends
- Success vs failures
- Token distribution

### Recent Invocations Table:
- Timestamp
- Session ID
- Prompt
- Duration
- Cost
- Status

## Metrics Collected Automatically

Every time you invoke the agent, it tracks:
- ⏱️ Response time
- 💵 Cost (input/output tokens × pricing)
- 🔧 Tools used
- ✅ Success/failure
- 📝 Prompt and response length
- 🔗 Session ID

## Pricing

Based on Claude Sonnet 4.5:
- Input: $0.003 per 1K tokens
- Output: $0.015 per 1K tokens

Example: A typical conversation (100 input + 200 output tokens) costs ~$0.0033

## Troubleshooting

**Metrics not showing?**

1. Check backend is running: `curl http://localhost:3001/api/health`
2. Check environment variable: `echo $DASHBOARD_API_URL`
3. Look for warnings in agent terminal

**Database error?**

```bash
cd server
rm database/ai-metrics.db
npm start
```

## Files Modified

- ✅ `WeatherBot/src/main.py` - Added metrics collection
- ✅ `WeatherBot/src/middleware/metrics.py` - Metrics collector (new)
- ✅ `server/server.js` - Added agent metrics API endpoints
- ✅ `server/database/schema.sql` - Added agent_metrics table
- ✅ `server/database/db.js` - Added agent metrics operations
- ✅ `src/services/api.js` - Added agent metrics API client
- ✅ `src/components/AgentMetricsDashboard.jsx` - Dashboard component (new)
- ✅ `src/App.jsx` - Added Agent Metrics tab

## Next Steps

1. ✅ Run some test invocations
2. ✅ Check the metrics dashboard
3. ✅ Monitor costs and performance
4. ✅ Optimize based on insights

## Full Documentation

See `AGENT_METRICS_INTEGRATION_GUIDE.md` for complete details.

---

**That's it!** Your agent metrics are now being tracked and visualized in real-time. 🚀
