# Database Setup Guide

## Overview
This guide explains how to set up and use the SQLite database backend for the AI Success Metrics Dashboard.

---

## 🗄️ Database Architecture

### Technology Stack
- **Database:** SQLite (file-based, no server required)
- **Backend:** Node.js + Express
- **ORM:** better-sqlite3 (fast, synchronous SQLite driver)
- **API:** RESTful JSON API

### Why SQLite?
- ✅ No separate database server needed
- ✅ Zero configuration
- ✅ Single file storage
- ✅ Fast and reliable
- ✅ Perfect for local/desktop applications
- ✅ Easy backup (just copy the .db file)

---

## 📊 Database Schema

### Tables

#### 1. **feedback**
Stores user feedback and suggestions
- `id` - Auto-increment primary key
- `page_name` - Dashboard page name
- `submission_date` - Date of submission
- `user_name` - Optional user name
- `user_email` - Optional user email
- `details` - Feedback text
- `timestamp` - Full timestamp
- `created_at` - Record creation time

#### 2. **use_cases**
Stores use case registry entries
- `id` - Unique identifier (UUID)
- `name` - Use case name
- `status` - Production/Pilot/Development
- `business_context` - Business context text
- `problem_statement` - Problem description
- `target_audience` - Target users
- `success_criteria` - Success metrics
- `created_at` - Record creation time
- `updated_at` - Last update time

#### 3. **kpis**
KPI metrics linked to use cases
- `id` - Auto-increment primary key
- `use_case_id` - Foreign key to use_cases
- `category` - KPI category
- `metric_name` - Metric name
- `baseline` - Baseline value
- `target` - Target value
- `measurement_frequency` - How often measured
- `data_source` - Data source

#### 4. **data_requirements**
Data requirements for use cases
- `id` - Auto-increment primary key
- `use_case_id` - Foreign key to use_cases
- `data_type` - Type of data
- `source_system` - Source system
- `volume` - Data volume
- `frequency` - Update frequency
- `quality_level` - Quality level
- `availability` - Availability status

#### 5. **risks**
Risk assessments for use cases
- `id` - Auto-increment primary key
- `use_case_id` - Foreign key to use_cases
- `category` - Risk category
- `description` - Risk description
- `likelihood` - Likelihood level
- `impact` - Impact level
- `mitigation` - Mitigation strategy

#### 6. **stakeholders**
Stakeholders for use cases
- `id` - Auto-increment primary key
- `use_case_id` - Foreign key to use_cases
- `role` - Stakeholder role
- `name` - Stakeholder name
- `responsibility` - Responsibilities
- `engagement_level` - Engagement level

#### 7. **milestones**
Project milestones for use cases
- `id` - Auto-increment primary key
- `use_case_id` - Foreign key to use_cases
- `phase` - Project phase
- `key_activities` - Key activities
- `duration` - Duration
- `target_date` - Target completion date
- `status` - Current status

---

## 🚀 Installation Steps

### Step 1: Install Server Dependencies

```bash
cd server
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `better-sqlite3` - SQLite driver
- `body-parser` - Request body parsing
- `nodemon` - Development auto-reload

### Step 2: Initialize Database

```bash
cd server
npm run init-db
```

This creates:
- `server/database/ai-metrics.db` - SQLite database file
- All tables with proper schema
- Indexes for performance

### Step 3: Start the Server

```bash
cd server
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Server will start on: `http://localhost:3001`

### Step 4: Configure Frontend

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:3001/api
```

### Step 5: Start Frontend

In a new terminal:

```bash
npm run dev
```

Frontend will start on: `http://localhost:3000`

---

## 🔌 API Endpoints

### Feedback Endpoints

```
GET    /api/feedback                    - Get all feedback
GET    /api/feedback/:id                - Get feedback by ID
GET    /api/feedback/page/:pageName     - Get feedback by page
GET    /api/feedback/search/:term       - Search feedback
POST   /api/feedback                    - Create feedback
DELETE /api/feedback/:id                - Delete feedback
```

### Use Case Endpoints

```
GET    /api/usecases                    - Get all use cases
GET    /api/usecases/:id                - Get use case with all related data
POST   /api/usecases                    - Create use case
PUT    /api/usecases/:id                - Update use case
DELETE /api/usecases/:id                - Delete use case
```

### Related Data Endpoints

```
GET    /api/usecases/:id/kpis           - Get KPIs for use case
POST   /api/kpis                        - Create KPI

GET    /api/usecases/:id/data-requirements  - Get data requirements
POST   /api/data-requirements           - Create data requirement

GET    /api/usecases/:id/risks          - Get risks
POST   /api/risks                       - Create risk

GET    /api/usecases/:id/stakeholders   - Get stakeholders
POST   /api/stakeholders                - Create stakeholder

GET    /api/usecases/:id/milestones     - Get milestones
POST   /api/milestones                  - Create milestone
```

### Utility Endpoints

```
GET    /api/health                      - Health check
GET    /api/export                      - Export all data
```

---

## 📝 Usage Examples

### Create Feedback (JavaScript)

```javascript
import { feedbackAPI } from './services/api';

const feedback = {
  pageName: 'Executive Overview',
  date: '2026-01-25',
  name: 'John Doe',
  email: 'john@example.com',
  details: 'Great dashboard!',
  timestamp: new Date().toISOString()
};

const result = await feedbackAPI.create(feedback);
console.log('Created:', result);
```

### Get All Feedback

```javascript
const allFeedback = await feedbackAPI.getAll();
console.log('Feedback:', allFeedback);
```

### Create Use Case with Related Data

```javascript
import { useCaseAPI } from './services/api';

const data = {
  useCase: {
    id: 'UC-001',
    name: 'Customer Service Chatbot',
    status: 'Production',
    businessContext: 'Improve customer support...'
  },
  kpis: [
    {
      category: 'Business Impact',
      metricName: 'Customer Satisfaction',
      baseline: '3.5',
      target: '4.5',
      measurementFrequency: 'Weekly',
      dataSource: 'Survey System'
    }
  ],
  risks: [
    {
      category: 'Model bias',
      description: 'Potential bias in responses',
      likelihood: 'Medium',
      impact: 'High',
      mitigation: 'Regular audits'
    }
  ]
};

const result = await useCaseAPI.create(data);
console.log('Created use case:', result);
```

---

## 🔧 Database Management

### View Database

Use any SQLite browser:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (Recommended)
- [SQLite Viewer](https://inloop.github.io/sqlite-viewer/) (Online)
- Command line: `sqlite3 server/database/ai-metrics.db`

### Backup Database

```bash
# Simple copy
cp server/database/ai-metrics.db server/database/ai-metrics-backup.db

# With timestamp
cp server/database/ai-metrics.db server/database/ai-metrics-$(date +%Y%m%d).db
```

### Reset Database

```bash
# Delete database file
rm server/database/ai-metrics.db

# Reinitialize
cd server
npm run init-db
```

### Export Data to JSON

```bash
curl http://localhost:3001/api/export > backup.json
```

---

## 🔄 Migration from localStorage

### Automatic Migration Script

Create `src/utils/migrate.js`:

```javascript
import { feedbackAPI } from '../services/api';
import { storage, STORAGE_KEYS } from './storage';

export async function migrateFromLocalStorage() {
  try {
    // Get data from localStorage
    const localFeedback = storage.getItem(STORAGE_KEYS.USER_FEEDBACK, []);
    
    if (localFeedback.length === 0) {
      console.log('No data to migrate');
      return;
    }

    // Migrate each feedback item
    for (const feedback of localFeedback) {
      await feedbackAPI.create(feedback);
    }

    console.log(`Migrated ${localFeedback.length} feedback items`);
    
    // Optionally clear localStorage after successful migration
    // storage.removeItem(STORAGE_KEYS.USER_FEEDBACK);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
```

Run migration:
```javascript
import { migrateFromLocalStorage } from './utils/migrate';
migrateFromLocalStorage();
```

---

## 🐛 Troubleshooting

### Server won't start

**Error:** `Cannot find module 'better-sqlite3'`
```bash
cd server
npm install
```

**Error:** `Port 3001 already in use`
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm start
```

### Database errors

**Error:** `SQLITE_CANTOPEN: unable to open database file`
```bash
# Ensure database directory exists
mkdir -p server/database

# Reinitialize
cd server
npm run init-db
```

**Error:** `SQLITE_CORRUPT: database disk image is malformed`
```bash
# Restore from backup or reset
rm server/database/ai-metrics.db
npm run init-db
```

### API connection errors

**Error:** `Failed to fetch`
- Check server is running: `curl http://localhost:3001/api/health`
- Check CORS settings in `server/server.js`
- Verify `.env` has correct API_URL

---

## 📊 Performance Optimization

### Indexes
Already created for common queries:
- Feedback by page name
- Feedback by timestamp
- Use cases by status
- All foreign key relationships

### Query Optimization

```javascript
// Good: Use specific queries
const feedback = await feedbackAPI.getByPage('Executive Overview');

// Avoid: Fetching all then filtering in JavaScript
const all = await feedbackAPI.getAll();
const filtered = all.filter(f => f.page_name === 'Executive Overview');
```

### Batch Operations

For bulk inserts, consider using transactions:

```javascript
// In server/database/db.js
export function createMultipleFeedback(feedbackArray) {
  const insert = db.prepare(`
    INSERT INTO feedback (page_name, submission_date, user_name, user_email, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(item.pageName, item.date, item.name, item.email, item.details, item.timestamp);
    }
  });

  insertMany(feedbackArray);
}
```

---

## 🔐 Security Considerations

### Current State
- ⚠️ No authentication
- ⚠️ No authorization
- ⚠️ No input validation
- ⚠️ No rate limiting
- ⚠️ CORS allows all origins

### Production Recommendations

1. **Add Authentication**
```javascript
// Example: JWT middleware
import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.use('/api', authenticateToken);
```

2. **Input Validation**
```javascript
import { body, validationResult } from 'express-validator';

app.post('/api/feedback',
  body('details').isLength({ min: 10, max: 5000 }),
  body('email').optional().isEmail(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

3. **Rate Limiting**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

---

## 📈 Monitoring

### Database Size

```javascript
import fs from 'fs';

const stats = fs.statSync('server/database/ai-metrics.db');
console.log(`Database size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
```

### Record Counts

```javascript
const counts = {
  feedback: db.prepare('SELECT COUNT(*) as count FROM feedback').get().count,
  useCases: db.prepare('SELECT COUNT(*) as count FROM use_cases').get().count,
  kpis: db.prepare('SELECT COUNT(*) as count FROM kpis').get().count
};
console.log('Record counts:', counts);
```

---

## 🎯 Next Steps

1. ✅ Database created
2. ✅ API endpoints implemented
3. ✅ Frontend API service created
4. ⏳ Update App.jsx to use API instead of localStorage
5. ⏳ Update FeedbackList to fetch from API
6. ⏳ Update UseCaseRegistry to save to API
7. ⏳ Add error handling and loading states
8. ⏳ Add authentication (optional)
9. ⏳ Deploy to production

---

**Created:** January 25, 2026  
**Version:** 1.0.0  
**Status:** Ready for Use ✅
