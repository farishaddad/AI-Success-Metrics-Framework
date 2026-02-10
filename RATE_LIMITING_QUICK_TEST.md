# 🎯 Rate Limiting - Quick Test Guide

## ✅ Quick Verification (1 minute)

### Test 1: Check Rate Limit Headers
```bash
curl -I http://localhost:3001/api/health | grep "RateLimit"
```

**Expected Output**:
```
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 900
```

✅ **Pass**: All 4 rate limit headers present

---

## 🧪 Detailed Tests

### Test 2: General API Rate Limit (100/15min)

**Make 5 requests**:
```bash
for i in {1..5}; do
  curl -s http://localhost:3001/api/health | jq .
  echo "Request $i"
done
```

**Expected**:
- All requests succeed
- `RateLimit-Remaining` decreases: 99, 98, 97, 96, 95

---

### Test 3: Login Rate Limit (5/15min)

**Try 6 failed logins**:
```bash
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"wrong"}' | jq .
  echo "Attempt $i"
  sleep 1
done
```

**Expected**:
- Attempts 1-5: `401 Unauthorized` (wrong password)
- Attempt 6: `429 Too Many Requests` (rate limited)

**Response on 6th attempt**:
```json
{
  "error": "Too many login attempts. Please try again in 15 minutes.",
  "retryAfter": "15 minutes"
}
```

---

### Test 4: Check Headers on Each Request

**Single request with headers**:
```bash
curl -I http://localhost:3001/api/health
```

**Look for**:
```
RateLimit-Policy: 100;w=900      ← Limit policy
RateLimit-Limit: 100             ← Max requests
RateLimit-Remaining: 99          ← Requests left
RateLimit-Reset: 900             ← Seconds until reset
```

---

## 📊 Rate Limit Summary

| Endpoint | Limit | Window | Test Command |
|----------|-------|--------|--------------|
| **All API** | 100 | 15 min | `curl http://localhost:3001/api/health` |
| **Login** | 5 | 15 min | `curl -X POST .../api/auth/login` |
| **Create User** | 30 | 15 min | `curl -X POST .../api/users` |
| **Password Reset** | 3 | 1 hour | `curl -X POST .../api/auth/change-password` |

---

## 🎨 What You'll See

### Normal Request (Within Limit)
```http
HTTP/1.1 200 OK
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 847
Content-Type: application/json
```

### Rate Limited Request (Exceeded)
```http
HTTP/1.1 429 Too Many Requests
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 234
Content-Type: application/json

{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

---

## 🔍 Monitoring

### Check Server Logs

**When rate limit is exceeded**:
```
⚠️  Rate limit exceeded for IP: ::1 on path: /api/health
⚠️  Auth rate limit exceeded for IP: ::1
```

### Watch Logs in Real-Time
```bash
cd server
npm start
# Watch console for rate limit warnings
```

---

## ✅ Success Indicators

**All Good If You See**:
- ✅ Rate limit headers in all API responses
- ✅ `RateLimit-Remaining` decreases with each request
- ✅ `429 Too Many Requests` after exceeding limit
- ✅ Clear error messages with retry information
- ✅ Console logs rate limit violations
- ✅ Server log shows: "Rate limiting enabled"

**Problem If You See**:
- ❌ No rate limit headers
- ❌ Unlimited requests allowed
- ❌ Server errors
- ❌ No console logs

---

## 🚀 Quick Commands

### Check Rate Limit Status
```bash
curl -I http://localhost:3001/api/health | grep "RateLimit"
```

### Test Login Rate Limit
```bash
# Try 6 times (should fail on 6th)
for i in {1..6}; do curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"username":"test","password":"wrong"}'; done
```

### Monitor Remaining Requests
```bash
# Make 10 requests and watch remaining count
for i in {1..10}; do curl -I http://localhost:3001/api/health 2>&1 | grep "RateLimit-Remaining"; done
```

---

## 🎯 Expected Behavior

### Scenario 1: Normal Usage
```
Request 1: RateLimit-Remaining: 99  ✅
Request 2: RateLimit-Remaining: 98  ✅
Request 3: RateLimit-Remaining: 97  ✅
...
Request 100: RateLimit-Remaining: 0 ✅
Request 101: 429 Too Many Requests  ✅
```

### Scenario 2: Login Attempts
```
Attempt 1: 401 Unauthorized         ✅ (wrong password)
Attempt 2: 401 Unauthorized         ✅
Attempt 3: 401 Unauthorized         ✅
Attempt 4: 401 Unauthorized         ✅
Attempt 5: 401 Unauthorized         ✅
Attempt 6: 429 Too Many Requests    ✅ (rate limited)
```

### Scenario 3: After Waiting
```
Wait 15 minutes...
Request: RateLimit-Remaining: 100   ✅ (reset)
```

---

## 🔧 Troubleshooting

### Headers Not Showing?
1. Check server is running: `curl http://localhost:3001/api/health`
2. Verify rate limiting is enabled in console log
3. Restart server if needed

### Rate Limit Not Working?
1. Check `server/middleware/rateLimiter.js` exists
2. Verify imports in route files
3. Check console for errors

### Always Getting 429?
1. Wait for rate limit window to expire (15 minutes)
2. Check if IP is correct (not behind proxy)
3. Restart server to reset counters

---

## 📈 Rate Limit Tiers

### Tier 1: General API (Lenient)
- **Limit**: 100 requests / 15 minutes
- **Use**: Regular API calls
- **Impact**: Low - most users won't hit this

### Tier 2: Data Modification (Moderate)
- **Limit**: 30 requests / 15 minutes
- **Use**: Creating/updating data
- **Impact**: Medium - prevents spam

### Tier 3: Authentication (Strict)
- **Limit**: 5 requests / 15 minutes
- **Use**: Login attempts
- **Impact**: High - prevents brute force

### Tier 4: Password Reset (Very Strict)
- **Limit**: 3 requests / 1 hour
- **Use**: Password changes/resets
- **Impact**: Very High - prevents abuse

---

## 🎉 Summary

✅ **4 rate limiters** active  
✅ **Standard headers** in responses  
✅ **Clear error messages** when exceeded  
✅ **Console logging** of violations  
✅ **Production ready** configuration  

**Test now**: `curl -I http://localhost:3001/api/health | grep "RateLimit"`

---

**Last Updated**: January 25, 2026  
**Status**: ✅ Active  
**Server**: http://localhost:3001  

🛡️ **Rate limiting is protecting your API!**
