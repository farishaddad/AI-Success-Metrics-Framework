# 🔒 HTTPS/SSL Configuration Guide

**Date**: January 25, 2026  
**Status**: Development + Production Guide

---

## 📋 Overview

This guide covers HTTPS/SSL configuration for both:
1. **Local Development** - Self-signed certificates for testing
2. **Production Deployment** - AWS Certificate Manager (ACM) + ALB

---

## 🏠 LOCAL DEVELOPMENT HTTPS

### Option 1: Using mkcert (Recommended for Development)

**mkcert** creates locally-trusted development certificates.

#### Step 1: Install mkcert

**macOS**:
```bash
brew install mkcert
brew install nss # for Firefox support
```

**Linux**:
```bash
# Ubuntu/Debian
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

**Windows**:
```powershell
choco install mkcert
```

#### Step 2: Install Local CA

```bash
mkcert -install
```

**Output**:
```
Created a new local CA 💥
The local CA is now installed in the system trust store! ⚡️
```

#### Step 3: Generate Certificates

```bash
# Navigate to project root
cd /path/to/ai-dashboard

# Create certs directory
mkdir -p certs

# Generate certificate for localhost
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
```

**Output**:
```
Created a new certificate valid for the following names 📜
 - "localhost"
 - "127.0.0.1"
 - "::1"

The certificate is at "certs/localhost.pem" and the key at "certs/localhost-key.pem" ✅
```

#### Step 4: Update Backend Server for HTTPS

Create `server/server-https.js`:

```javascript
import 'dotenv/config';
import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { generalLimiter } from './middleware/rateLimiter.js';
import { feedbackDB, useCaseDB } from './db-simple.js';
import { initializeDefaultAdmin } from './auth/authService.js';
import { authenticate, requireAdmin } from './auth/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize default admin user
await initializeDefaultAdmin();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'https://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && NODE_ENV === 'development') {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
};

// Security Headers - Helmet Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  ieNoOpen: true,
  dnsPrefetchControl: { allow: false },
  hidePoweredBy: true
}));

// Additional custom security headers
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  if (req.path.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Apply general rate limiter
app.use('/api/', generalLimiter);

// Input sanitization middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
});

console.log(`✅ Server configured for ${NODE_ENV} environment`);
console.log(`✅ CORS allowed origins: ${allowedOrigins.join(', ')}`);
console.log(`✅ Security headers enabled (Helmet + Custom headers)`);
console.log(`✅ Rate limiting enabled (General: 100/15min, Auth: 5/15min, Create: 30/15min)`);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    https: req.secure,
    protocol: req.protocol
  });
});

// Feedback routes
app.get('/api/feedback', authenticate, async (req, res) => {
  try {
    const feedback = await feedbackDB.getAll();
    res.json(feedback);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.post('/api/feedback', authenticate, async (req, res) => {
  try {
    const feedback = await feedbackDB.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

app.get('/api/feedback/:id', authenticate, async (req, res) => {
  try {
    const feedback = await feedbackDB.getById(req.params.id);
    if (feedback) {
      res.json(feedback);
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.delete('/api/feedback/:id', authenticate, async (req, res) => {
  try {
    await feedbackDB.delete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// Use case routes
app.get('/api/usecases', authenticate, async (req, res) => {
  try {
    const useCases = await useCaseDB.getAll();
    res.json(useCases);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch use cases' });
  }
});

app.post('/api/usecases', authenticate, async (req, res) => {
  try {
    const useCase = await useCaseDB.create(req.body);
    res.status(201).json(useCase);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create use case' });
  }
});

app.get('/api/usecases/:id', authenticate, async (req, res) => {
  try {
    const useCase = await useCaseDB.getById(req.params.id);
    if (useCase) {
      res.json(useCase);
    } else {
      res.status(404).json({ error: 'Use case not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch use case' });
  }
});

// Export all data
app.get('/api/export', authenticate, requireAdmin, async (req, res) => {
  try {
    const feedback = await feedbackDB.getAll();
    const useCases = await useCaseDB.getAll();
    res.json({
      feedback,
      useCases,
      exportDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// HTTPS Server Configuration
if (NODE_ENV === 'development') {
  try {
    const certPath = path.join(__dirname, '..', 'certs', 'localhost.pem');
    const keyPath = path.join(__dirname, '..', 'certs', 'localhost-key.pem');
    
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
      
      https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
        console.log(`🔒 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
        console.log(`📊 HTTPS API endpoints available at https://localhost:${HTTPS_PORT}/api`);
      });
    } else {
      console.warn('⚠️  SSL certificates not found. Run: mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost');
    }
  } catch (error) {
    console.error('❌ Failed to start HTTPS server:', error.message);
  }
}

// HTTP Server (for development)
app.listen(PORT, () => {
  console.log(`🚀 HTTP Server running on http://localhost:${PORT}`);
  console.log(`📊 HTTP API endpoints available at http://localhost:${PORT}/api`);
});
```

#### Step 5: Update package.json

Add HTTPS start script to `server/package.json`:

```json
{
  "scripts": {
    "start": "node server-simple.js",
    "start:https": "node server-https.js",
    "dev": "nodemon server-https.js"
  }
}
```

#### Step 6: Update Environment Variables

Add to `server/.env`:

```bash
# HTTPS Configuration
HTTPS_PORT=3443
ALLOWED_ORIGINS=http://localhost:3000,https://localhost:3000,http://localhost:5173,https://localhost:5173
```

#### Step 7: Update Frontend Configuration

Update `.env`:

```bash
# Use HTTPS for API
VITE_API_URL=https://localhost:3443/api
```

#### Step 8: Start HTTPS Server

```bash
cd server
npm run start:https
```

**Expected Output**:
```
✅ Server configured for development environment
✅ CORS allowed origins: http://localhost:3000, https://localhost:3000
✅ Security headers enabled (Helmet + Custom headers)
✅ Rate limiting enabled (General: 100/15min, Auth: 5/15min, Create: 30/15min)
🔒 HTTPS Server running on https://localhost:3443
📊 HTTPS API endpoints available at https://localhost:3443/api
🚀 HTTP Server running on http://localhost:3001
📊 HTTP API endpoints available at http://localhost:3001/api
```

#### Step 9: Test HTTPS

```bash
# Test HTTPS endpoint
curl -k https://localhost:3443/api/health

# Check SSL certificate
openssl s_client -connect localhost:3443 -showcerts
```

---

## 🌐 PRODUCTION HTTPS (AWS)

### Option 1: AWS Certificate Manager (ACM) + Application Load Balancer

This is the **recommended approach** for production.

#### Step 1: Request SSL Certificate

**Via AWS Console**:
1. Go to AWS Certificate Manager (ACM)
2. Click "Request a certificate"
3. Choose "Request a public certificate"
4. Enter domain names:
   - `yourdomain.com`
   - `www.yourdomain.com`
   - `*.yourdomain.com` (wildcard, optional)
5. Choose validation method: **DNS validation** (recommended)
6. Click "Request"

**Via AWS CLI**:
```bash
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names www.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

**Output**:
```json
{
  "CertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/abc123..."
}
```

#### Step 2: Validate Certificate

**DNS Validation** (Recommended):

1. ACM will provide CNAME records
2. Add these records to your DNS (Route 53, Cloudflare, etc.)

**Example CNAME Record**:
```
Name: _abc123.yourdomain.com
Type: CNAME
Value: _xyz789.acm-validations.aws.
```

**Via Route 53**:
```bash
# ACM can automatically create validation records in Route 53
# Just click "Create records in Route 53" button in console
```

**Wait for validation** (usually 5-30 minutes):
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/abc123... \
  --query 'Certificate.Status'
```

**Expected**: `"ISSUED"`

#### Step 3: Create Application Load Balancer

**Via AWS Console**:

1. Go to EC2 → Load Balancers
2. Click "Create Load Balancer"
3. Choose "Application Load Balancer"
4. Configure:
   - Name: `ai-metrics-dashboard-alb`
   - Scheme: Internet-facing
   - IP address type: IPv4
   - VPC: Select your VPC
   - Subnets: Select at least 2 availability zones

5. Configure Security Groups:
   - Create new security group
   - Allow inbound:
     - HTTP (80) from 0.0.0.0/0
     - HTTPS (443) from 0.0.0.0/0

6. Configure Listeners:
   - **HTTPS:443**
     - Default action: Forward to target group
     - SSL certificate: Select your ACM certificate
   - **HTTP:80**
     - Default action: Redirect to HTTPS

7. Create Target Group:
   - Target type: Instance or IP
   - Protocol: HTTP
   - Port: 3001
   - Health check path: `/api/health`

8. Register targets (your EC2 instances)

9. Review and create

**Via CloudFormation** (see `aws/cloudformation-template.yaml`):

```yaml
Resources:
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: ai-metrics-dashboard-alb
      Scheme: internet-facing
      Type: application
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref ALBSecurityGroup

  HTTPSListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      LoadBalancerArn: !Ref ApplicationLoadBalancer
      Port: 443
      Protocol: HTTPS
      Certificates:
        - CertificateArn: !Ref SSLCertificateArn
      DefaultActions:
        - Type: forward
          TargetGroupArn: !Ref TargetGroup

  HTTPListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      LoadBalancerArn: !Ref ApplicationLoadBalancer
      Port: 80
      Protocol: HTTP
      DefaultActions:
        - Type: redirect
          RedirectConfig:
            Protocol: HTTPS
            Port: 443
            StatusCode: HTTP_301
```

#### Step 4: Update DNS

Point your domain to the ALB:

**Route 53**:
```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "yourdomain.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z35SXDOTRQ7X7K",
          "DNSName": "ai-metrics-dashboard-alb-123456789.us-east-1.elb.amazonaws.com",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

**Other DNS Providers**:
- Create A record or CNAME pointing to ALB DNS name
- Example: `yourdomain.com` → `ai-metrics-dashboard-alb-123456789.us-east-1.elb.amazonaws.com`

#### Step 5: Update Application Configuration

Update `server/.env.production`:

```bash
NODE_ENV=production
PORT=3001

# JWT Configuration
JWT_SECRET=your-super-secret-production-key-min-32-characters

# CORS Configuration - HTTPS only
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# AWS
AWS_REGION=us-east-1
```

Update frontend `.env.production`:

```bash
VITE_API_URL=https://yourdomain.com/api
```

#### Step 6: Deploy Application

```bash
# Build frontend
npm run build

# Deploy to EC2/ECS/Elastic Beanstalk
# (See AWS_DEPLOYMENT_GUIDE.md for details)
```

#### Step 7: Verify HTTPS

```bash
# Test HTTPS
curl -I https://yourdomain.com/api/health

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -showcerts

# Test SSL grade
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

**Expected SSL Labs Grade**: A or A+

---

### Option 2: Let's Encrypt (Alternative)

For self-managed servers (EC2 without ALB).

#### Step 1: Install Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Amazon Linux 2
sudo yum install certbot python3-certbot-nginx
```

#### Step 2: Obtain Certificate

```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

**Certificates will be saved to**:
- Certificate: `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

#### Step 3: Configure Node.js Server

Update `server/server-simple.js`:

```javascript
import https from 'https';
import fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
};

https.createServer(httpsOptions, app).listen(443, () => {
  console.log('🔒 HTTPS Server running on port 443');
});
```

#### Step 4: Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Set up auto-renewal (cron)
sudo crontab -e

# Add this line (renew twice daily)
0 0,12 * * * certbot renew --quiet
```

---

## 🧪 Testing HTTPS Configuration

### Test 1: Basic HTTPS Connection

```bash
curl -I https://yourdomain.com/api/health
```

**Expected**:
```
HTTP/2 200
strict-transport-security: max-age=31536000; includeSubDomains; preload
content-security-policy: default-src 'self';...
x-frame-options: DENY
...
```

### Test 2: SSL Certificate

```bash
openssl s_client -connect yourdomain.com:443 -showcerts
```

**Check for**:
- Certificate chain
- Expiration date
- Issuer

### Test 3: HSTS Header

```bash
curl -I https://yourdomain.com/api/health | grep -i strict-transport-security
```

**Expected**:
```
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

### Test 4: HTTP to HTTPS Redirect

```bash
curl -I http://yourdomain.com/api/health
```

**Expected**:
```
HTTP/1.1 301 Moved Permanently
Location: https://yourdomain.com/api/health
```

### Test 5: SSL Labs Test

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com

**Expected Grade**: A or A+

### Test 6: Security Headers

```bash
curl -I https://yourdomain.com/api/health | grep -E "(Content-Security-Policy|Strict-Transport-Security|X-Frame-Options)"
```

**Expected**: All security headers present

---

## 📊 SSL/TLS Best Practices

### 1. Use Strong Cipher Suites

**For ALB** (AWS manages this automatically)

**For Node.js**:
```javascript
const httpsOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  ciphers: [
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384'
  ].join(':'),
  honorCipherOrder: true,
  minVersion: 'TLSv1.2'
};
```

### 2. Enable HSTS

Already configured in Helmet:
```javascript
hsts: {
  maxAge: 31536000,  // 1 year
  includeSubDomains: true,
  preload: true
}
```

### 3. Redirect HTTP to HTTPS

**ALB**: Configure redirect listener  
**Node.js**:
```javascript
app.use((req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});
```

### 4. Certificate Renewal

**ACM**: Automatic renewal  
**Let's Encrypt**: Auto-renewal via certbot

### 5. Monitor Certificate Expiration

Set up CloudWatch alarms or use services like:
- SSL Labs
- Uptime Robot
- Pingdom

---

## 🎯 Checklist

### Development HTTPS ✅
- [ ] Install mkcert
- [ ] Generate local certificates
- [ ] Create server-https.js
- [ ] Update package.json scripts
- [ ] Update environment variables
- [ ] Test HTTPS locally

### Production HTTPS ✅
- [ ] Request ACM certificate
- [ ] Validate certificate (DNS)
- [ ] Create Application Load Balancer
- [ ] Configure HTTPS listener (443)
- [ ] Configure HTTP redirect (80 → 443)
- [ ] Create target group
- [ ] Register EC2 instances
- [ ] Update DNS records
- [ ] Update application config
- [ ] Deploy application
- [ ] Test HTTPS connection
- [ ] Verify SSL Labs grade
- [ ] Test HTTP redirect
- [ ] Verify security headers

---

## 🎉 Summary

### Development
✅ **mkcert** for local HTTPS testing  
✅ **Self-signed certificates** trusted by browser  
✅ **Dual HTTP/HTTPS** servers for flexibility  

### Production
✅ **AWS Certificate Manager** for SSL certificates  
✅ **Application Load Balancer** for HTTPS termination  
✅ **Automatic certificate renewal**  
✅ **HTTP to HTTPS redirect**  
✅ **A+ SSL Labs grade**  

---

**Last Updated**: January 25, 2026  
**Status**: Ready to implement  
**Next Step**: Choose development or production setup  

🔒 **Secure your application with HTTPS!**
