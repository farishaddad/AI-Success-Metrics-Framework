# AWS Production Deployment Guide

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Docker installed (for containerization)
- Node.js 18+ installed
- Domain name and SSL certificate

## Quick Start

### 1. Install Production Dependencies

```bash
# Backend dependencies
cd server
npm install
cd ..

# Frontend dependencies
npm install
```

### 2. Configure Environment Variables

```bash
# Copy example files
cp .env.production.example .env.production
cp server/.env.example server/.env

# Edit with your values
nano .env.production
nano server/.env
```

### 3. Build for Production

```bash
# Build frontend
npm run build

# Test production build locally
npm run preview
```

### 4. Deploy to AWS

Choose one of the deployment methods below.

---

## Deployment Option 1: AWS Elastic Beanstalk (Easiest)

### Step 1: Install EB CLI

```bash
pip install awsebcli
```

### Step 2: Initialize Elastic Beanstalk

```bash
eb init -p docker ai-metrics-dashboard --region us-east-1
```

### Step 3: Create Environment

```bash
eb create production-env \
  --instance-type t3.small \
  --envvars NODE_ENV=production,ALLOWED_ORIGINS=https://yourdomain.com
```

### Step 4: Deploy

```bash
eb deploy
```

### Step 5: Configure Domain

```bash
eb setenv DOMAIN_NAME=yourdomain.com
```

---

## Deployment Option 2: AWS ECS Fargate (Recommended)

### Step 1: Build and Push Docker Image

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name ai-metrics-dashboard

# Build image
docker build -t ai-metrics-dashboard .

# Tag image
docker tag ai-metrics-dashboard:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-metrics-dashboard:latest

# Push image
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/ai-metrics-dashboard:latest
```

### Step 2: Deploy CloudFormation Stack

```bash
aws cloudformation create-stack \
  --stack-name ai-metrics-production \
  --template-body file://aws/cloudformation-template.yaml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=DomainName,ParameterValue=dashboard.yourdomain.com \
    ParameterKey=CertificateArn,ParameterValue=arn:aws:acm:us-east-1:xxx:certificate/xxx \
    ParameterKey=AllowedOrigins,ParameterValue=https://dashboard.yourdomain.com \
  --capabilities CAPABILITY_IAM
```

### Step 3: Create ECS Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://aws/task-definition.json
```

### Step 4: Create ECS Service

```bash
aws ecs create-service \
  --cluster ai-metrics-cluster-production \
  --service-name ai-metrics-service \
  --task-definition ai-metrics-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### Step 5: Deploy Frontend to S3

```bash
# Build frontend
npm run build

# Sync to S3
aws s3 sync dist/ s3://ai-metrics-frontend-production/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id EXXXXXXXXXXXXX --paths "/*"
```

---

## Deployment Option 3: AWS Amplify (Frontend Only)

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify

```bash
amplify init
```

### Step 3: Add Hosting

```bash
amplify add hosting
# Choose: Hosting with Amplify Console
# Choose: Manual deployment
```

### Step 4: Deploy

```bash
amplify publish
```

---

## Post-Deployment Configuration

### 1. Configure DNS

Point your domain to:
- **CloudFront**: Create CNAME record to CloudFront distribution
- **ALB**: Create A record (alias) to Application Load Balancer

### 2. Configure SSL/TLS

```bash
# Request certificate in ACM
aws acm request-certificate \
  --domain-name dashboard.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

### 3. Set Up Monitoring

```bash
# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name ai-metrics-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### 4. Configure Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/ai-metrics-cluster-production/ai-metrics-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/ai-metrics-cluster-production/ai-metrics-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

---

## Security Checklist

### Before Deployment

- [ ] Remove all hardcoded credentials
- [ ] Configure environment variables
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS restrictions
- [ ] Enable rate limiting
- [ ] Add input validation
- [ ] Configure security headers
- [ ] Set up WAF rules
- [ ] Enable CloudWatch logging
- [ ] Configure backup strategy

### After Deployment

- [ ] Test authentication
- [ ] Verify HTTPS works
- [ ] Test CORS configuration
- [ ] Verify rate limiting
- [ ] Check CloudWatch logs
- [ ] Test health checks
- [ ] Verify auto-scaling
- [ ] Test disaster recovery
- [ ] Run security scan
- [ ] Perform load testing

---

## Monitoring and Maintenance

### CloudWatch Dashboards

Create custom dashboard:

```bash
aws cloudwatch put-dashboard \
  --dashboard-name ai-metrics-dashboard \
  --dashboard-body file://aws/cloudwatch-dashboard.json
```

### Log Analysis

```bash
# View logs
aws logs tail /ecs/ai-metrics-production --follow

# Search logs
aws logs filter-log-events \
  --log-group-name /ecs/ai-metrics-production \
  --filter-pattern "ERROR"
```

### Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
aws s3 cp server/database/db.json s3://ai-metrics-backups/db-$DATE.json
EOF

chmod +x backup.sh

# Schedule with cron
crontab -e
# Add: 0 */6 * * * /path/to/backup.sh
```

---

## Troubleshooting

### Issue: Container won't start

```bash
# Check ECS task logs
aws ecs describe-tasks --cluster ai-metrics-cluster-production --tasks <task-id>

# Check CloudWatch logs
aws logs tail /ecs/ai-metrics-production --follow
```

### Issue: High response times

```bash
# Check ECS metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/ECS \
  --metric-name CPUUtilization \
  --dimensions Name=ServiceName,Value=ai-metrics-service \
  --start-time 2026-01-25T00:00:00Z \
  --end-time 2026-01-25T23:59:59Z \
  --period 3600 \
  --statistics Average
```

### Issue: Database connection errors

```bash
# Check EFS mount (if using)
aws efs describe-mount-targets --file-system-id fs-xxx

# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxx
```

---

## Cost Optimization

### Development Environment (~$35/month)

- EC2 t3.small: $15
- RDS db.t3.micro: $15
- S3 + CloudFront: $5

### Production Environment (~$140/month)

- ECS Fargate (2 tasks): $60
- RDS db.t3.small: $30
- S3 + CloudFront: $20
- ALB: $20
- CloudWatch: $10

### Cost Reduction Tips

1. Use Fargate Spot for non-critical workloads (70% savings)
2. Enable S3 Intelligent-Tiering
3. Use CloudFront caching effectively
4. Right-size ECS tasks
5. Use Reserved Instances for predictable workloads
6. Enable AWS Cost Explorer
7. Set up billing alarms

---

## Rollback Procedure

### Quick Rollback

```bash
# ECS: Update service to previous task definition
aws ecs update-service \
  --cluster ai-metrics-cluster-production \
  --service ai-metrics-service \
  --task-definition ai-metrics-task:PREVIOUS_VERSION

# S3: Restore previous version
aws s3api list-object-versions --bucket ai-metrics-frontend-production
aws s3api copy-object \
  --copy-source ai-metrics-frontend-production/index.html?versionId=xxx \
  --bucket ai-metrics-frontend-production \
  --key index.html
```

### Full Rollback

```bash
# CloudFormation: Rollback stack
aws cloudformation cancel-update-stack --stack-name ai-metrics-production

# Or delete and recreate
aws cloudformation delete-stack --stack-name ai-metrics-production
aws cloudformation create-stack --stack-name ai-metrics-production --template-body file://aws/cloudformation-template.yaml
```

---

## Support and Resources

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Application Load Balancer Guide](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/)

---

## Next Steps

1. Review PRODUCTION_READINESS_REPORT.md
2. Complete security fixes
3. Set up CI/CD pipeline
4. Configure monitoring and alerting
5. Perform load testing
6. Schedule go-live date
7. Create runbooks for common operations
8. Train team on AWS console and CLI

---

**Last Updated**: January 25, 2026  
**Version**: 1.0.0
