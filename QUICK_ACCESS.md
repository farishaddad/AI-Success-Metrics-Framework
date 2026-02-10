# 🚀 Quick Access Guide

## Your Deployed Application

### 🌐 Frontend
**URL**: https://d1mn3y0kt35m94.cloudfront.net  
**Status**: Deploying (wait 10-15 min)

### 🔐 Login
```
Username: admin
Password: Admin@2026!
```

### 🔧 Backend API
**URL**: http://54.92.133.91:3001  
**Health**: http://54.92.133.91:3001/api/health

### 🤖 AI Agent
**URL**: http://34.205.43.67:8081  
**Model**: Claude Sonnet 4.5

---

## Quick Commands

### Check CloudFront Status
```bash
aws cloudfront get-distribution --id EKBJN2F798AOM \
  --profile account-444 --query 'Distribution.Status' --output text
```

### View Backend Logs
```bash
aws logs tail /ecs/ai-dashboard-backend --follow \
  --region us-east-1 --profile account-444
```

### View Agent Logs
```bash
aws logs tail /ecs/ai-dashboard-agent --follow \
  --region us-east-1 --profile account-444
```

### Check Service Health
```bash
aws ecs describe-services --cluster ai-dashboard-cluster \
  --services ai-dashboard-backend-service ai-dashboard-agent-service \
  --region us-east-1 --profile account-444 \
  --query 'services[*].[serviceName,status,runningCount]' --output table
```

---

## 💰 Estimated Cost
**~$40-50/month** (plus Bedrock usage)

---

## 📖 Full Documentation
See `DEPLOYMENT_SUCCESS.md` for complete details.
