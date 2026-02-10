# AWS Connection - Quick Reference Card

## ✅ Your AWS Account

```
Account ID:  844416514454
Profile:     account-444
Region:      us-east-1
User:        agentcore-dev
Status:      ✅ Connected
```

## 🚀 Quick Commands

### Verify Connection
```bash
./verify-aws-connection.sh
```

### Start Everything
```bash
./START_DASHBOARD.sh
```

### Check AWS Account
```bash
aws sts get-caller-identity --profile account-444
```

### List Available Models
```bash
aws bedrock list-foundation-models --region us-east-1 --profile account-444
```

### Test Agent
```bash
curl -X POST http://localhost:8081/invocations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello!", "session_id": "test"}'
```

## 📊 Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Agent | http://localhost:8081 |

## 💰 Pricing

| Token Type | Price |
|------------|-------|
| Input | $0.003 / 1K tokens |
| Output | $0.015 / 1K tokens |

## 🔑 Configuration Files

```
WeatherBot/.env          → Agent config
server/.env              → Backend config
.env                     → Frontend config
~/.aws/credentials       → AWS credentials
~/.aws/config            → AWS config
```

## 📚 Documentation

- `AWS_ACCOUNT_SETUP.md` - Full setup guide
- `AWS_CONNECTION_SUMMARY.md` - Connection summary
- `README.md` - Project overview
- `TROUBLESHOOTING.md` - Common issues

## ⚡ Troubleshooting

**Agent won't start?**
```bash
export AWS_PROFILE=account-444
cd WeatherBot && bash start_with_metrics.sh
```

**Check if services running?**
```bash
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :8081  # Agent
```

**View logs?**
```bash
# Check agent startup
cd WeatherBot
bash start_with_metrics.sh
```

---

**Need Help?** Check `AWS_ACCOUNT_SETUP.md` for detailed instructions.
