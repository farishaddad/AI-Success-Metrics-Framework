# 🔧 Agent Metrics Dashboard Troubleshooting Guide

## Issue: Agent Metrics Tab Not Displaying Anything

### Quick Checklist

1. **Verify All Servers Are Running**
   ```bash
   # Check backend server (port 3001)
   curl http://localhost:3001/api/health
   
   # Check frontend server (port 3000)
   curl http://localhost:3000
   
   # Check agent server (port 8081)
   curl -X POST http://localhost:8081/invocations \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test", "session_id": "test"}'
   ```

2. **Test API Endpoints Directly**
   ```bash
   # Test summary endpoint
   curl http://localhost:3001/api/agent-metrics/summary
   
   # Test all metrics endpoint
   curl http://localhost:3001/api/agent-metrics
   ```

3. **Check Browser Console**
   - Open http://localhost:3000
   - Press F12 to open Developer Tools
   - Go to Console tab
   - Look for any red error messages
   - Check Network tab for failed requests

### Common Issues and Solutions

#### Issue 1: "Failed to load agent metrics" Error

**Cause:** Backend server not running or API URL misconfigured

**Solution:**
```bash
# Check if backend is running
ps aux | grep "node server-simple.js"

# If not running, start it
cd server
npm start

# Verify API URL in .env file
cat .env | grep VITE_API_URL
# Should show: VITE_API_URL=http://localhost:3001/api
```

#### Issue 2: Blank Page or White Screen

**Cause:** Frontend build issue or authentication problem

**Solution:**
1. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check if you're logged in
4. Restart frontend server:
   ```bash
   # Stop and restart
   npm run dev
   ```

#### Issue 3: CORS Errors in Console

**Cause:** CORS configuration blocking requests

**Solution:**
The backend is configured to allow requests from localhost:3000. If you see CORS errors:
1. Check the backend console for CORS warnings
2. Verify the frontend is running on port 3000
3. Check server/server-simple.js CORS configuration

#### Issue 4: No Data Showing (Empty Dashboard)

**Cause:** No metrics have been collected yet

**Solution:**
1. Send a test request to the agent:
   ```bash
   curl -X POST http://localhost:8081/invocations \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello, what can you do?", "session_id": "test_session"}'
   ```

2. Wait a few seconds for metrics to be collected

3. Refresh the dashboard

4. Check if metrics were saved:
   ```bash
   curl http://localhost:3001/api/agent-metrics/summary
   ```

#### Issue 5: Chat Interface Not Showing

**Cause:** Chat toggle button not clicked or component not loaded

**Solution:**
1. Look for the "💬 Show Chat" button in the dashboard header
2. Click it to toggle the chat interface
3. If button is missing, check browser console for errors

### Step-by-Step Debugging

1. **Verify Backend API**
   ```bash
   # Test health endpoint
   curl http://localhost:3001/api/health
   # Expected: {"status":"ok","message":"Server is running"}
   
   # Test metrics summary
   curl http://localhost:3001/api/agent-metrics/summary
   # Expected: JSON with metrics data
   ```

2. **Verify Frontend is Loading**
   - Open http://localhost:3000
   - Login with credentials (check LOGIN_CREDENTIALS.txt)
   - Navigate through tabs to ensure app is working
   - Click on "🤖 Agent Metrics" tab

3. **Check Browser Developer Tools**
   - Open Console (F12)
   - Look for errors (red text)
   - Check Network tab:
     - Filter by "agent-metrics"
     - Look for failed requests (red status codes)
     - Check request/response details

4. **Verify Component Files Exist**
   ```bash
   ls -la src/components/AgentMetricsDashboard.jsx
   ls -la src/components/AgentChatInterface.jsx
   ls -la src/components/AgentMetricsDashboard.css
   ls -la src/components/AgentChatInterface.css
   ```

5. **Check for JavaScript Errors**
   - Open browser console
   - Look for syntax errors or import errors
   - Check if React components are rendering

### Manual Testing Steps

1. **Open Test Page**
   - Open `test_agent_dashboard.html` in your browser
   - Click each test button
   - Verify all tests pass

2. **Test Agent Directly**
   ```bash
   # Send test request
   curl -X POST http://localhost:8081/invocations \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Calculate 5 + 3", "session_id": "manual_test"}' \
     --no-buffer
   ```

3. **Verify Metrics Were Saved**
   ```bash
   # Check database file
   cat server/database/db.json | grep -A 5 "agentMetrics"
   
   # Or use API
   curl http://localhost:3001/api/agent-metrics | python3 -m json.tool
   ```

### Environment Variables Check

```bash
# Check frontend .env
cat .env
# Should contain: VITE_API_URL=http://localhost:3001/api

# Check backend .env
cat server/.env
# Should contain appropriate settings

# Check agent .env
cat WeatherBot/.env
# Should contain: DASHBOARD_API_URL=http://localhost:3001/api
```

### Process Status Check

```bash
# Check all running processes
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :8081  # Agent

# Or use ps
ps aux | grep -E "(vite|node|uvicorn)"
```

### Database Check

```bash
# Verify database file exists and has data
cat server/database/db.json | python3 -m json.tool

# Check agentMetrics collection
cat server/database/db.json | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Agent Metrics Count: {len(data.get(\"agentMetrics\", []))}')"
```

### Still Not Working?

If you've tried all the above and it's still not working:

1. **Restart Everything**
   ```bash
   # Stop all processes
   pkill -f "vite"
   pkill -f "node server-simple.js"
   pkill -f "uvicorn"
   
   # Start backend
   cd server && npm start &
   
   # Start frontend
   cd .. && npm run dev &
   
   # Start agent
   cd WeatherBot && bash start_with_metrics.sh &
   ```

2. **Check Logs**
   - Backend logs: Check terminal where `npm start` is running
   - Frontend logs: Check terminal where `npm run dev` is running
   - Agent logs: Check terminal where agent is running
   - Browser console: F12 → Console tab

3. **Verify File Integrity**
   ```bash
   # Check if files were modified correctly
   git status
   git diff src/components/AgentMetricsDashboard.jsx
   git diff src/components/AgentChatInterface.jsx
   ```

4. **Create Fresh Test Data**
   ```bash
   # Send multiple test requests to generate data
   for i in {1..5}; do
     curl -X POST http://localhost:8081/invocations \
       -H "Content-Type: application/json" \
       -d "{\"prompt\": \"Test $i\", \"session_id\": \"test_$i\"}" \
       --no-buffer
     sleep 2
   done
   ```

### Contact Information

If you're still experiencing issues, provide:
- Browser console errors (screenshot or copy/paste)
- Backend server logs
- Output of: `curl http://localhost:3001/api/agent-metrics/summary`
- Output of: `curl http://localhost:3001/api/health`

---

**Last Updated:** January 28, 2026
