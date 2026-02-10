# 🔒 Setup Local HTTPS - Quick Guide

**Time Required**: 5 minutes  
**Difficulty**: Easy

---

## 📋 Prerequisites

- macOS, Linux, or Windows
- Node.js installed
- Terminal access

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install mkcert (2 minutes)

**macOS**:
```bash
brew install mkcert
brew install nss  # for Firefox support
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

**Windows**:
```powershell
choco install mkcert
```

---

### Step 2: Generate Certificates (1 minute)

```bash
# Install local Certificate Authority
mkcert -install

# Navigate to your project
cd "/Users/fahaddad/Documents/AI Dashboard"

# Create certs directory
mkdir -p certs

# Generate certificates for localhost
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
```

**Expected Output**:
```
Created a new local CA 💥
The local CA is now installed in the system trust store! ⚡️

Created a new certificate valid for the following names 📜
 - "localhost"
 - "127.0.0.1"
 - "::1"

The certificate is at "certs/localhost.pem" and the key at "certs/localhost-key.pem" ✅
```

---

### Step 3: Start HTTPS Server (30 seconds)

```bash
# Start backend with HTTPS
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
✅ SSL/TLS enabled with local certificates
🚀 HTTP Server running on http://localhost:3001
📊 HTTP API endpoints available at http://localhost:3001/api
```

---

## ✅ Verify HTTPS is Working

### Test 1: Check HTTPS Endpoint

```bash
curl https://localhost:3443/api/health
```

**Expected**:
```json
{
  "status": "ok",
  "message": "Server is running",
  "https": true,
  "protocol": "https"
}
```

### Test 2: Check Security Headers

```bash
curl -I https://localhost:3443/api/health | grep -i "strict-transport-security"
```

**Expected**:
```
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

### Test 3: Open in Browser

1. Open browser
2. Go to: https://localhost:3443/api/health
3. Should see JSON response (no certificate warning!)

---

## 🔧 Update Frontend to Use HTTPS

### Option 1: Update .env (Recommended)

Edit `.env` in project root:

```bash
# Change from HTTP to HTTPS
VITE_API_URL=https://localhost:3443/api
```

### Option 2: Keep HTTP (No Changes Needed)

The server runs both HTTP and HTTPS simultaneously:
- HTTP: http://localhost:3001
- HTTPS: https://localhost:3443

You can use either!

---

## 🧪 Test Full Application with HTTPS

### Step 1: Start Backend with HTTPS

```bash
cd server
npm run start:https
```

### Step 2: Start Frontend

```bash
# In new terminal, from project root
npm run dev
```

### Step 3: Test Login

1. Open http://localhost:3000 (or https://localhost:3000 if Vite supports it)
2. Login with: `admin` / `Admin@2026!`
3. Check browser console - API calls should go to HTTPS endpoint

---

## 📊 What You Get

### Before (HTTP Only)
```
Frontend: http://localhost:3000
Backend:  http://localhost:3001
Security: ⚠️ No encryption
```

### After (HTTPS Enabled)
```
Frontend: http://localhost:3000 (or https)
Backend:  https://localhost:3443 ✅
Security: 🔒 Full encryption
HSTS:     ✅ Enabled
SSL/TLS:  ✅ Active
```

---

## 🎯 Benefits

✅ **Test HTTPS Locally** - Same as production  
✅ **No Certificate Warnings** - Trusted by browser  
✅ **HSTS Testing** - Verify security headers  
✅ **Mixed Content Detection** - Find HTTP resources  
✅ **Service Worker Testing** - Requires HTTPS  
✅ **Production Parity** - Match production environment  

---

## 🔍 Troubleshooting

### Issue: "mkcert: command not found"

**Solution**: Install mkcert (see Step 1)

---

### Issue: Certificate files not found

**Error**:
```
⚠️  SSL certificates not found at:
   Certificate: /path/to/certs/localhost.pem
   Key: /path/to/certs/localhost-key.pem
```

**Solution**:
```bash
# Make sure you're in project root
cd "/Users/fahaddad/Documents/AI Dashboard"

# Create certs directory
mkdir -p certs

# Generate certificates
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
```

---

### Issue: Browser shows certificate warning

**Solution**: Run `mkcert -install` to install the local CA

---

### Issue: HTTPS server not starting

**Check**:
1. Certificates exist: `ls -la certs/`
2. Correct permissions: `chmod 600 certs/*.pem`
3. Port 3443 not in use: `lsof -i :3443`

---

## 📝 Files Created

After setup, you'll have:

```
AI Dashboard/
├── certs/
│   ├── localhost.pem          # SSL certificate
│   └── localhost-key.pem      # Private key
├── server/
│   ├── server-simple.js       # HTTP server (existing)
│   ├── server-https.js        # HTTPS server (new)
│   └── .env                   # Updated with HTTPS_PORT
└── .gitignore                 # Should include certs/
```

---

## 🔒 Security Notes

### Development Certificates

✅ **Safe for development** - Only trusted on your machine  
✅ **Not for production** - Use ACM or Let's Encrypt  
✅ **Automatically trusted** - No browser warnings  
✅ **Easy to revoke** - `mkcert -uninstall`  

### .gitignore

Make sure `certs/` is in `.gitignore`:

```bash
# Add to .gitignore
certs/
*.pem
```

---

## 🎉 Summary

### What We Did

1. ✅ Installed mkcert
2. ✅ Generated local SSL certificates
3. ✅ Created HTTPS server (server-https.js)
4. ✅ Updated package.json with HTTPS scripts
5. ✅ Updated .env with HTTPS configuration

### What You Can Do Now

✅ Test HTTPS locally  
✅ Verify security headers  
✅ Test HSTS behavior  
✅ Debug SSL issues before production  
✅ Match production environment  

### Next Steps

1. **For Development**: Use `npm run start:https`
2. **For Production**: Follow SSL_CONFIGURATION_GUIDE.md for AWS setup

---

**Setup Time**: 5 minutes  
**Status**: ✅ Ready to use  
**HTTPS URL**: https://localhost:3443  

🔒 **Your local development environment now has HTTPS!**
