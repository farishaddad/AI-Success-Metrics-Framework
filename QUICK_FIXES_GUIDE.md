# Quick Fixes Guide - Get Production Ready Fast

## 🚀 Fast Track to Production (3 Days Minimum)

This guide shows the absolute minimum changes needed to deploy safely.

---

## Day 1: Critical Security (4-6 hours)

### Step 1: Install Security Dependencies (5 minutes)

```bash
cd server
npm install helmet express-rate-limit express-validator bcryptjs jsonwebtoken dotenv winston compression
cd ..
```

### Step 2: Switch to Production Server (2 minutes)

Edit `server/package.json`:

```json
{
  "scripts": {
    "start": "node server-production.js",
    "dev": "nodemon server-simple.js"
  }
}
```

### Step 3: Configure Environment Variables (10 minutes)

Create `server/.env`:

```bash
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com
JWT_SECRET=your-super-secret-key-min-32-chars
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

Create `.env.production`:

```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_ENV=production
```

### Step 4: Fix API Service (2 minutes)

File: `src/services/api.js`

✅ Already fixed! No localhost fallback.

### Step 5: Remove Console.log Statements (30 minutes)

Search and replace in all files:

```bash
# Find all console.log
grep -r "console.log" src/

# Replace with conditional logging
# Before:
console.log('Debug info');

# After:
if (import.meta.env.DEV) {
  console.log('Debug info');
}
```

Or simply remove them all:

```bash
# macOS/Linux
find src -name "*.jsx" -o -name "*.js" | xargs sed -i '' '/console\.log/d'
```

### Step 6: Fix Login Page (1 hour)

File: `src/components/LoginPage.jsx`

Replace hardcoded credentials section:

```javascript
// BEFORE (lines 14-15):
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'ai-metrics-2026';

// AFTER:
import { validateCredentials } from '../config/auth';

// In handleSubmit function:
const isValid = await validateCredentials(username, password);
if (isValid) {
  onLogin();
} else {
  setError('Invalid credentials');
}
```

Remove demo credentials display (lines 116-120):

```javascript
// DELETE THIS:
<p className="demo-info">
  <strong>Username:</strong> admin<br />
  <strong>Password:</strong> ai-metrics-2026
</p>
```

### Step 7: Test Locally (30 minutes)

```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
npm run dev

# Test in browser
open http://localhost:3000
```

---

## Day 2: Build and Deploy (4-6 hours)

### Step 1: Build Frontend (5 minutes)

```bash
npm run build
```

### Step 2: Test Production Build (10 minutes)

```bash
npm run preview
# Visit http://localhost:4173
```

### Step 3: Create Docker Image (30 minutes)

```bash
# Build
docker build -t ai-metrics-dashboard .

# Test locally
docker run -p 3001:3001 --env-file server/.env ai-metrics-dashboard

# Verify
curl http://localhost:3001/health
```

### Step 4: Set Up AWS (2 hours)

```bash
# Install AWS CLI
pip install awscli

# Configure
aws configure

# Request SSL certificate
aws acm request-certificate \
  --domain-name dashboard.yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# Note the certificate ARN
```

### Step 5: Deploy to AWS (2 hours)

**Option A: Elastic Beanstalk (Easiest)**

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p docker ai-metrics-dashboard

# Create environment
eb create production

# Deploy
eb deploy
```

**Option B: ECS Fargate (Recommended)**

```bash
# Push to ECR
aws ecr create-repository --repository-name ai-metrics-dashboard
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag ai-metrics-dashboard:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-metrics-dashboard:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-metrics-dashboard:latest

# Deploy CloudFormation
aws cloudformation create-stack \
  --stack-name ai-metrics-production \
  --template-body file://aws/cloudformation-template.yaml \
  --parameters file://aws/parameters.json \
  --capabilities CAPABILITY_IAM
```

---

## Day 3: Configure and Test (4-6 hours)

### Step 1: Configure DNS (30 minutes)

Point your domain to AWS:
- CloudFront: Create CNAME record
- ALB: Create A record (alias)

### Step 2: Set Up Monitoring (1 hour)

```bash
# Create CloudWatch alarm for errors
aws cloudwatch put-metric-alarm \
  --alarm-name ai-metrics-errors \
  --alarm-description "Alert on errors" \
  --metric-name Errors \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold

# Create alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name ai-metrics-high-cpu \
  --alarm-description "Alert on high CPU" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Step 3: Test Everything (2 hours)

```bash
# Test health endpoint
curl https://api.yourdomain.com/health

# Test CORS
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://api.yourdomain.com/api/feedback

# Test rate limiting
for i in {1..110}; do
  curl https://api.yourdomain.com/api/feedback
done

# Should get 429 after 100 requests
```

### Step 4: Load Testing (1 hour)

```bash
# Install Apache Bench
# macOS: brew install httpd
# Linux: apt-get install apache2-utils

# Test with 100 concurrent users
ab -n 1000 -c 100 https://yourdomain.com/

# Test API
ab -n 1000 -c 100 https://api.yourdomain.com/api/health
```

### Step 5: Security Check (1 hour)

```bash
# Check security headers
curl -I https://yourdomain.com/

# Should see:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000

# Run security scan
npm install -g snyk
snyk test

# Check for vulnerabilities
npm audit
```

---

## Verification Checklist

### Before Going Live

- [ ] All console.log statements removed or wrapped
- [ ] Hardcoded credentials removed
- [ ] Environment variables configured
- [ ] HTTPS working
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] Security headers present
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] DNS configured
- [ ] SSL certificate valid
- [ ] Load testing passed
- [ ] Security scan passed

### Test These URLs

- [ ] https://yourdomain.com (frontend)
- [ ] https://yourdomain.com/health (should 404 or redirect)
- [ ] https://api.yourdomain.com/health (backend health)
- [ ] https://api.yourdomain.com/api/health (API health)
- [ ] https://api.yourdomain.com/api/feedback (should work)

---

## Common Issues and Quick Fixes

### Issue: "VITE_API_URL is required"

**Fix**: Create `.env.production` file:

```bash
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production
npm run build
```

### Issue: CORS errors in browser

**Fix**: Update `server/.env`:

```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Restart server.

### Issue: Rate limit not working

**Fix**: Ensure `trust proxy` is set:

```javascript
// In server-production.js
app.set('trust proxy', 1);
```

### Issue: Container won't start

**Fix**: Check logs:

```bash
docker logs <container-id>

# Or in AWS:
aws logs tail /ecs/ai-metrics-production --follow
```

### Issue: High response times

**Fix**: Check if running in production mode:

```bash
echo $NODE_ENV  # Should be "production"
```

---

## Emergency Rollback

If something goes wrong:

```bash
# Elastic Beanstalk
eb abort  # Cancel current deployment
eb deploy --version <previous-version>

# ECS
aws ecs update-service \
  --cluster ai-metrics-cluster-production \
  --service ai-metrics-service \
  --task-definition ai-metrics-task:<previous-version>

# CloudFront (frontend)
aws s3 sync s3://ai-metrics-frontend-production-backup/ s3://ai-metrics-frontend-production/
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

---

## Post-Deployment

### Monitor for 24 Hours

```bash
# Watch logs
aws logs tail /ecs/ai-metrics-production --follow

# Check metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=ai-metrics-service \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

### Week 1 Tasks

- [ ] Review CloudWatch logs daily
- [ ] Check error rates
- [ ] Monitor costs
- [ ] Gather user feedback
- [ ] Fix any critical bugs
- [ ] Optimize performance

---

## Cost Optimization Tips

1. **Use Fargate Spot** (70% savings):
   ```bash
   # Update capacity provider strategy
   aws ecs put-cluster-capacity-providers \
     --cluster ai-metrics-cluster-production \
     --capacity-providers FARGATE FARGATE_SPOT \
     --default-capacity-provider-strategy \
       capacityProvider=FARGATE_SPOT,weight=1
   ```

2. **Enable S3 Intelligent-Tiering**:
   ```bash
   aws s3api put-bucket-intelligent-tiering-configuration \
     --bucket ai-metrics-frontend-production \
     --id EntireBucket \
     --intelligent-tiering-configuration file://tiering-config.json
   ```

3. **Set CloudWatch log retention**:
   ```bash
   aws logs put-retention-policy \
     --log-group-name /ecs/ai-metrics-production \
     --retention-in-days 30
   ```

---

## Success!

If you've completed all steps:

✅ Your application is now running securely on AWS  
✅ HTTPS is configured  
✅ Security headers are in place  
✅ Rate limiting is active  
✅ Monitoring is configured  
✅ You're ready for production traffic!

**Next**: Review PRODUCTION_READINESS_REPORT.md for additional improvements.

---

**Time Investment**: 12-18 hours over 3 days  
**Cost**: ~$140/month AWS + one-time setup  
**Result**: Production-ready, secure application
