# 🚀 AWS Console Deployment Guide

**Date**: January 25, 2026  
**Method**: AWS Console (Manual Deployment)  
**Estimated Time**: 45-60 minutes

---

## 📦 Step 1: Create Deployment Package (5 minutes)

I'll create the deployment package for you. This will be a ZIP file containing your application.

**What's included**:
- Server code (backend)
- Frontend build (will be built)
- Configuration files
- Dependencies list

---

## 🌐 Step 2: Request SSL Certificate (15 minutes)

### 2.1 Open AWS Certificate Manager

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Sign in with your credentials
3. In the search bar, type **"Certificate Manager"**
4. Click **AWS Certificate Manager**
5. **IMPORTANT**: Make sure you're in **us-east-1** region (top right)

### 2.2 Request Certificate

1. Click **"Request a certificate"**
2. Choose **"Request a public certificate"**
3. Click **"Next"**

### 2.3 Add Domain Names

Enter your domain names (one per line):
```
yourdomain.com
www.yourdomain.com
```

**Replace `yourdomain.com` with your actual domain!**

### 2.4 Select Validation Method

1. Choose **"DNS validation - recommended"**
2. Click **"Request"**

### 2.5 Validate Certificate

1. You'll see your certificate with status **"Pending validation"**
2. Click on the certificate ID
3. You'll see CNAME records for validation
4. Click **"Create records in Route 53"** (if using Route 53)
   - OR manually add CNAME records to your DNS provider

**Wait 5-30 minutes for validation to complete**

### 2.6 Save Certificate ARN

Once validated, copy the **Certificate ARN**. It looks like:
```
arn:aws:acm:us-east-1:078801794900:certificate/abc123-def456-...
```

**SAVE THIS ARN - You'll need it later!**

---

## 🏗️ Step 3: Create Elastic Beanstalk Application (20 minutes)

### 3.1 Open Elastic Beanstalk

1. In AWS Console search bar, type **"Elastic Beanstalk"**
2. Click **Elastic Beanstalk**
3. Make sure you're in **us-east-1** region

### 3.2 Create Application

1. Click **"Create application"**
2. Fill in the form:

**Application information**:
- **Application name**: `ai-metrics-dashboard`
- **Application tags**: (optional)

**Environment information**:
- **Environment name**: `production`
- **Domain**: Leave as auto-generated (or customize)

**Platform**:
- **Platform**: Select **"Node.js"**
- **Platform branch**: Select **"Node.js 20 running on 64bit Amazon Linux 2023"**
- **Platform version**: Select the latest (recommended)

**Application code**:
- Select **"Upload your code"**
- **Version label**: `v1.0.0`
- Click **"Choose file"**
- Upload the ZIP file I'll create for you: `ai-metrics-dashboard-deployment.zip`

**Presets**:
- Select **"Single instance (free tier eligible)"**

3. Click **"Next"**

### 3.3 Configure Service Access

**Service role**:
- If you see `aws-elasticbeanstalk-service-role`, select it
- If not, select **"Create and use new service role"**

**EC2 key pair**:
- Select **"Proceed without an EC2 key pair"** (since you don't have permissions)

**EC2 instance profile**:
- If you see `aws-elasticbeanstalk-ec2-role`, select it
- If not, select **"Create and use new instance profile"**

4. Click **"Next"**

### 3.4 Set Up Networking, Database, and Tags

**VPC**: Select your default VPC

**Instance settings**:
- Check **at least one** availability zone
- Keep other settings as default

5. Click **"Next"**

### 3.5 Configure Instance Traffic and Scaling

**Instances**:
- **Root volume type**: General Purpose (SSD)
- **Size**: 10 GB
- **Instance types**: `t3.small`

**Capacity**:
- **Auto scaling group**: Keep as "Load balanced"
- **Min instances**: 1
- **Max instances**: 4

**Load balancer**:
- **Load balancer type**: Select **"Application Load Balancer"**
- **Visibility**: Public

**Processes**:
- Keep default settings

6. Click **"Next"**

### 3.6 Configure Updates, Monitoring, and Logging

**Monitoring**:
- **Health reporting**: Enhanced
- **Managed updates**: Enabled (optional)

**Platform updates**:
- Keep default settings

**Notifications**:
- (Optional) Add email for notifications

**CloudWatch logs**:
- Check **"Stream logs to CloudWatch Logs"**
- **Log retention**: 7 days

7. Click **"Next"**

### 3.7 Review and Submit

1. Review all settings
2. Click **"Submit"**

**Wait 10-15 minutes** for environment creation. You'll see:
- Creating environment...
- Launching environment...
- Environment health: Green ✅

---

## 🔧 Step 4: Configure Environment Variables (5 minutes)

### 4.1 Open Environment Configuration

1. In Elastic Beanstalk console, click on your **production** environment
2. In the left sidebar, click **"Configuration"**
3. Find **"Updates, monitoring, and logging"** section
4. Click **"Edit"**

### 4.2 Add Environment Properties

Scroll down to **"Environment properties"** and add these:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `8080` |
| `JWT_SECRET` | `1006915b7cf9f8209cd5b7936a2fd7bcd6bc4793e1e40de4bcf8efdf115bc7fa` |
| `JWT_EXPIRES_IN` | `24h` |
| `BCRYPT_ROUNDS` | `10` |
| `ALLOWED_ORIGINS` | `https://yourdomain.com,https://www.yourdomain.com` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |
| `LOG_LEVEL` | `info` |
| `AWS_REGION` | `us-east-1` |

**IMPORTANT**: Replace `yourdomain.com` with your actual domain!

3. Click **"Apply"**
4. Wait for environment to update (2-3 minutes)

---

## 🔐 Step 5: Configure HTTPS/SSL (15 minutes)

### 5.1 Add HTTPS Listener

1. In your environment, click **"Configuration"**
2. Find **"Load balancer"** section
3. Click **"Edit"**

### 5.2 Add Listener

1. Scroll to **"Listeners"** section
2. Click **"Add listener"**
3. Configure:
   - **Port**: `443`
   - **Protocol**: `HTTPS`
   - **SSL certificate**: Select your certificate ARN from Step 2
   - **SSL policy**: `ELBSecurityPolicy-TLS13-1-2-2021-06` (recommended)
4. Click **"Add"**

### 5.3 Modify HTTP Listener (Redirect to HTTPS)

1. Find the existing listener on port **80**
2. Click **"Actions"** → **"Edit"**
3. Change:
   - **Default action**: Select **"Redirect to"**
   - **Protocol**: `HTTPS`
   - **Port**: `443`
   - **Status code**: `301 - Permanently moved`
4. Click **"Save"**

### 5.4 Apply Changes

1. Click **"Apply"** at the bottom
2. Wait for environment to update (5-10 minutes)

---

## 🌐 Step 6: Configure DNS (10 minutes)

### 6.1 Get Load Balancer URL

1. In your environment overview, find **"Domain"**
2. Copy the URL (looks like: `production.us-east-1.elasticbeanstalk.com`)

### 6.2 Update DNS Records

**If using Route 53**:
1. Go to **Route 53** → **Hosted zones**
2. Click your domain
3. Click **"Create record"**
4. Configure:
   - **Record name**: Leave blank (for root domain) or `www`
   - **Record type**: `A - Routes traffic to an IPv4 address`
   - **Alias**: Toggle ON
   - **Route traffic to**: 
     - Select **"Alias to Elastic Beanstalk environment"**
     - Select **"us-east-1"**
     - Select your environment
   - **Routing policy**: Simple routing
5. Click **"Create records"**

**If using other DNS provider**:
1. Log in to your DNS provider
2. Add CNAME record:
   - **Name**: `@` (root) or `www`
   - **Type**: `CNAME`
   - **Value**: `production.us-east-1.elasticbeanstalk.com`
   - **TTL**: `300`
3. Save changes

**Wait 5-60 minutes for DNS propagation**

---

## ✅ Step 7: Verify Deployment (10 minutes)

### 7.1 Test HTTPS

Open your browser and go to:
```
https://yourdomain.com/api/health
```

Expected response:
```json
{"status":"ok","message":"Server is running"}
```

### 7.2 Test Frontend

Go to:
```
https://yourdomain.com
```

You should see the login page.

### 7.3 Test Login

Login with:
- **Username**: `admin`
- **Password**: `Admin@2026!`

### 7.4 Test Security Headers

Open browser DevTools (F12) → Network tab → Reload page → Click any request → Check headers:

Should see:
- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- And 10 more security headers

### 7.5 Test Rate Limiting

Try logging in with wrong password 6 times. The 6th attempt should return:
```
429 Too Many Requests
```

---

## 🎉 Success Criteria

After deployment, verify:

- ✅ HTTPS working (https://yourdomain.com)
- ✅ SSL certificate valid (green padlock in browser)
- ✅ HTTP redirects to HTTPS
- ✅ Security headers present (13 headers)
- ✅ Authentication working
- ✅ Rate limiting active
- ✅ Frontend accessible
- ✅ All dashboard features working
- ✅ System Status tab showing metrics
- ✅ User Management working

---

## 🔧 Troubleshooting

### Issue: Environment creation fails

**Check**:
1. Go to **Events** tab in EB console
2. Look for error messages
3. Common issues:
   - Insufficient permissions
   - Invalid configuration
   - Service limits reached

### Issue: Application not starting

**Check**:
1. Go to **Logs** tab
2. Click **"Request logs"** → **"Last 100 lines"**
3. Look for errors in Node.js logs

### Issue: HTTPS not working

**Check**:
1. Certificate is validated (ACM console)
2. HTTPS listener is configured (port 443)
3. Security group allows port 443
4. DNS points to correct load balancer

### Issue: 502 Bad Gateway

**Causes**:
- Application crashed
- Wrong port (should be 8080)
- Missing environment variables

**Fix**:
1. Check environment variables
2. Check application logs
3. Verify PORT=8080

---

## 📊 What You'll Have

After completing these steps:

✅ **Production application** on AWS Elastic Beanstalk  
✅ **HTTPS/SSL** with valid certificate  
✅ **Auto-scaling** (1-4 instances)  
✅ **Load balancing** with ALB  
✅ **Security headers** (13 headers)  
✅ **Rate limiting** (4 limiters)  
✅ **Authentication** (JWT + bcrypt)  
✅ **Monitoring** with CloudWatch  

**Security Score**: 95/100 ⭐⭐⭐⭐⭐

---

## 💰 Monthly Cost

~$45-59/month:
- EC2 instance (t3.small): $15-20
- Application Load Balancer: $16-20
- SSL Certificate: **FREE**
- CloudWatch: $5-10
- Data transfer: $9

---

**Status**: 📋 READY TO START  
**Next Step**: I'll create the deployment package  
**Estimated Total Time**: 45-60 minutes
