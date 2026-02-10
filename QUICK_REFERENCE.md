# Quick Reference Guide

**AI Success Metrics Dashboard - Daily Operations**

---

## 🚀 Starting the System

### Option 1: All Services at Once
```bash
./START_DASHBOARD.sh
```

### Option 2: Individual Services
```bash
# Terminal 1 - Backend API
cd server
npm start

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - AI Agent
cd WeatherBot
bash start_with_metrics.sh
```

---

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main dashboard UI |
| Backend API | http://localhost:3001/api | REST API endpoints |
| AI Agent | http://localhost:8081 | Agent invocations |

---

## 🔑 Default Credentials

```
Username: admin
Password: Admin@2026!
```

⚠️ **Change the password after first login!**

---

## 📊 Dashboard Tabs

1. **Executive Overview** - Health scores, ROI, strategic alignment
2. **Business Impact** - Revenue, market share, innovation
3. **Operational Efficiency** - Process optimization, productivity
4. **Model Performance** - Technical metrics, fairness
5. **Customer Experience** - CSAT, NPS, retention
6. **Innovation Capacity** - Innovation velocity, upskilling
7. **Economic Efficiency** - ROI analysis, cost breakdown
8. **ROI Tracking** - Four-pillar ROI view
9. **Project Details** - Project-level drill-down
10. **🤖 Agent Demo** - Interactive AI agent with metrics

---

## 🤖 Using the Agent Demo

### Quick Test Prompts
```
"Hello, what can you do?"
"Calculate 15 * 23"
"Write a Python function to reverse a string"
"What's the weather like today?"
"Help me understand machine learning"
```

### Features
- **Real-time Chat**: Streaming responses from Claude Sonnet 4.5
- **Metrics Tracking**: Automatic performance and cost monitoring
- **Session Management**: Each conversation has a unique session ID
- **Cost Transparency**: Real-time token usage and cost calculation

---

## 🔧 Common Commands

### Check Service Status
```bash
# Check if services are running
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :8081  # Agent
```

### Stop Services
```bash
# Kill a service by port
kill -9 $(lsof -t -i:3000)  # Frontend
kill -9 $(lsof -t -i:3001)  # Backend
kill -9 $(lsof -t -i:8081)  # Agent
```

### Restart Services
```bash
# Stop all services (Ctrl+C in each terminal)
# Then restart using the start commands above
```

### View Logs
```bash
# Backend logs
cd server && npm start

# Agent logs
cd WeatherBot && bash start_with_metrics.sh

# Frontend logs
npm run dev
```

---

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find and kill the process
lsof -i :3000  # or :3001 or :8081
kill -9 <PID>
```

### AWS Connection Issues
```bash
# Verify AWS credentials
aws sts get-caller-identity --profile account-444

# Check Bedrock access
aws bedrock list-foundation-models --region us-east-1 --profile account-444

# Run verification script
bash verify-aws-connection.sh
```

### CORS Errors
- Ensure agent server is running on port 8081
- Check CORS configuration in `WeatherBot/src/main.py`
- Verify frontend origin is allowed in backend CORS settings

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in `server/.env`
- Verify user exists in database

### Database Issues
```bash
# Check database file
cat server/database/db.json

# Reset database (⚠️ deletes all data)
rm server/database/db.json
# Restart backend to recreate with default admin
```

---

## 📁 Important Files

### Configuration Files
```
.env                          # Frontend config
server/.env                   # Backend config
WeatherBot/.env              # Agent config
```

### Database
```
server/database/db.json      # All data (users, feedback, metrics)
```

### Logs
```
server/logs/                 # Backend logs (if configured)
WeatherBot/logs/            # Agent logs (if configured)
```

---

## 🔐 Security

### Change Admin Password
1. Log in as admin
2. Go to User Management tab
3. Click "Reset Password" for admin user
4. Enter new password (min 8 chars, uppercase, lowercase, number, special char)

### Create New User
1. Log in as admin
2. Go to User Management tab
3. Click "Add User"
4. Fill in details and select role (Admin/Guest)
5. Click "Create User"

### API Rate Limits
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Create endpoints: 30 requests per 15 minutes

---

## 📊 Monitoring

### Check Agent Metrics
1. Go to "🤖 Agent Demo" tab
2. View KPI cards for summary
3. Check charts for trends
4. Review recent invocations table

### Check System Health
```bash
# Backend health check
curl http://localhost:3001/api/health

# Agent health check
curl http://localhost:8081/health
```

### View Metrics Summary
```bash
# Get metrics summary via API
curl http://localhost:3001/api/agent-metrics/summary
```

---

## 💰 Cost Tracking

### Pricing Model
- **Input Tokens**: $0.003 per 1,000 tokens
- **Output Tokens**: $0.015 per 1,000 tokens
- **Average Cost**: < $0.01 per invocation

### View Costs
1. Go to "🤖 Agent Demo" tab
2. Check "Total Cost" KPI card
3. View "Cost Over Time" chart
4. Review "Cost Breakdown" panel

---

## 🔄 Updates and Maintenance

### Update Dependencies
```bash
# Frontend
npm update

# Backend
cd server && npm update && cd ..

# Agent
cd WeatherBot && pip3 install --upgrade -e . && cd ..
```

### Backup Database
```bash
# Create backup
cp server/database/db.json server/database/db.backup.json

# Restore from backup
cp server/database/db.backup.json server/database/db.json
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear browser cache
# Use browser developer tools (Ctrl+Shift+Delete)
```

---

## 📚 Documentation

### Quick Links
- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Current status
- [USER_GUIDE.md](USER_GUIDE.md) - User instructions
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues
- [AWS_CONNECTION_SUMMARY.md](AWS_CONNECTION_SUMMARY.md) - AWS setup

### Specifications
- [Requirements](.kiro/specs/ai-agent-demo/requirements.md) - Feature requirements
- [Design](.kiro/specs/ai-agent-demo/design.md) - Technical design

---

## 🆘 Getting Help

### Common Issues
1. **Port conflicts**: Kill existing processes
2. **AWS errors**: Verify credentials and Bedrock access
3. **CORS errors**: Check agent CORS configuration
4. **Auth errors**: Clear localStorage and re-login
5. **Database errors**: Check db.json file exists

### Debug Mode
```bash
# Enable debug logging
export DEBUG=*

# Run with verbose output
npm run dev -- --debug
```

### Contact Support
- Check documentation files
- Review error logs
- Verify all services are running
- Test with example prompts

---

## ⚡ Performance Tips

### Optimize Frontend
- Clear browser cache regularly
- Use latest browser version
- Disable unnecessary browser extensions
- Close unused tabs

### Optimize Backend
- Monitor database file size
- Archive old metrics periodically
- Use appropriate time ranges for queries
- Enable caching (future enhancement)

### Optimize Agent
- Use shorter prompts when possible
- Avoid unnecessary tool calls
- Monitor token usage
- Set appropriate timeouts

---

## 🎯 Best Practices

### Daily Operations
1. ✅ Start all services before use
2. ✅ Check system health regularly
3. ✅ Monitor agent metrics
4. ✅ Review error logs
5. ✅ Backup database weekly

### Security
1. ✅ Change default password immediately
2. ✅ Use strong passwords (8+ chars, mixed case, numbers, special chars)
3. ✅ Log out when done
4. ✅ Don't share credentials
5. ✅ Review user access regularly

### Cost Management
1. ✅ Monitor token usage
2. ✅ Set budget alerts (future)
3. ✅ Use efficient prompts
4. ✅ Review cost trends
5. ✅ Archive old data

---

## 📞 Quick Commands Cheat Sheet

```bash
# Start everything
./START_DASHBOARD.sh

# Check what's running
lsof -i :3000 :3001 :8081

# Kill all services
kill -9 $(lsof -t -i:3000 -i:3001 -i:8081)

# Verify AWS
aws sts get-caller-identity --profile account-444

# Check backend health
curl http://localhost:3001/api/health

# View database
cat server/database/db.json | jq

# Backup database
cp server/database/db.json server/database/db.backup.$(date +%Y%m%d).json

# Update all dependencies
npm update && cd server && npm update && cd ..
```

---

**Last Updated**: February 6, 2026  
**Version**: 1.0  
**Status**: Active
