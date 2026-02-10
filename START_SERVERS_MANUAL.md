# Manual Server Start Guide

Since the automated script isn't working, follow these steps manually:

## Step 1: Install Server Dependencies

Open Terminal and run:

```bash
cd "/Users/fahaddad/Documents/AI Dashboard/server"
npm install
```

This will install:
- express
- cors
- better-sqlite3
- body-parser

## Step 2: Initialize Database

Still in the server directory:

```bash
npm run init-db
```

You should see: "✅ Database initialized successfully"

## Step 3: Start Backend Server

In the same terminal (or keep it open):

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3001
📊 API endpoints available at http://localhost:3001/api
```

**Keep this terminal window open!**

## Step 4: Start Frontend

Open a **NEW** terminal window and run:

```bash
cd "/Users/fahaddad/Documents/AI Dashboard"
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 5: Verify Everything Works

1. **Check Backend Health:**
   - Open browser: http://localhost:3001/api/health
   - Should see: `{"status":"ok","message":"Server is running"}`

2. **Check Frontend:**
   - Open browser: http://localhost:3000
   - Should see the login page

3. **Test Database:**
   - Login to the dashboard
   - Submit feedback from any dashboard
   - Check User Suggestions tab - feedback should appear

## Troubleshooting

### If npm install fails in server:

```bash
cd "/Users/fahaddad/Documents/AI Dashboard/server"
rm -rf node_modules
rm package-lock.json
npm install
```

### If port 3001 is already in use:

```bash
lsof -ti:3001 | xargs kill -9
```

Then restart the server.

### If database initialization fails:

```bash
cd "/Users/fahaddad/Documents/AI Dashboard/server"
rm -rf database/ai-metrics.db
npm run init-db
```

## Quick Commands Summary

**Terminal 1 (Backend):**
```bash
cd "/Users/fahaddad/Documents/AI Dashboard/server"
npm install
npm run init-db
npm start
```

**Terminal 2 (Frontend):**
```bash
cd "/Users/fahaddad/Documents/AI Dashboard"
npm run dev
```

## What's Running

- **Backend API:** http://localhost:3001
- **Frontend:** http://localhost:3000
- **Database:** server/database/ai-metrics.db

## To Stop Servers

Press `Ctrl+C` in each terminal window.

---

**Ready to start!** Open two terminal windows and follow the steps above.
