# Data Storage Guide - AI Success Metrics Dashboard

## Overview
This document explains where and how user input is stored in the application.

---

## 📍 Storage Locations

### 1. **Browser localStorage** (Primary Storage)

All user data is currently stored in the browser's localStorage. This is **client-side only** storage.

#### Location:
- **Browser:** Chrome/Firefox/Safari/Edge
- **Path:** Browser DevTools → Application → Local Storage → `http://localhost:3000`
- **Persistence:** Data persists until manually cleared or browser cache is cleared

#### What's Stored:

##### A. User Feedback/Suggestions
**Key:** `userFeedback`  
**Format:** JSON array  
**Data Structure:**
```json
[
  {
    "id": 1737849600000,
    "pageName": "Executive Overview",
    "date": "2026-01-25",
    "name": "John Doe",
    "email": "john@example.com",
    "details": "Suggestion text here...",
    "timestamp": "2026-01-25T10:30:00.000Z"
  }
]
```

**Captured From:**
- Feedback modal on any dashboard
- Submitted via "💡 Suggest Changes" button

**Size Limit:** ~5-10MB (browser dependent)

##### B. Use Case Registry Data
**Key:** Component state (not persisted to localStorage yet)  
**Status:** ⚠️ **NOT CURRENTLY SAVED** - Data is lost on page refresh

**Data Includes:**
- Use case form entries (12 sections)
- KPI tables
- Risk assessments
- Stakeholder information
- Timeline data

**Location:** React component state in `UseCaseRegistry.jsx`

---

## 🔍 How to View Stored Data

### Method 1: Browser DevTools

#### Chrome/Edge:
1. Press `F12` or right-click → Inspect
2. Go to **Application** tab
3. Expand **Local Storage** in left sidebar
4. Click on your domain (e.g., `http://localhost:3000`)
5. View all stored keys and values

#### Firefox:
1. Press `F12` or right-click → Inspect
2. Go to **Storage** tab
3. Expand **Local Storage**
4. Click on your domain
5. View stored data

#### Safari:
1. Enable Developer menu: Preferences → Advanced → Show Develop menu
2. Develop → Show Web Inspector
3. Go to **Storage** tab
4. Select **Local Storage**

### Method 2: JavaScript Console

Open browser console (`F12` → Console) and run:

```javascript
// View all feedback
console.log(JSON.parse(localStorage.getItem('userFeedback')));

// View all localStorage keys
console.log(Object.keys(localStorage));

// View all localStorage data
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

---

## 💾 Storage Capacity

### localStorage Limits:
- **Chrome/Edge:** ~10MB
- **Firefox:** ~10MB
- **Safari:** ~5MB
- **Mobile browsers:** ~5MB

### Current Usage:
- **Feedback entries:** ~1-2KB per entry
- **Estimated capacity:** ~5,000-10,000 feedback entries before hitting limits

---

## ⚠️ Important Limitations

### 1. **Client-Side Only**
- Data is stored **only in the user's browser**
- Not shared across devices
- Not accessible to other users
- Not backed up to a server

### 2. **Data Loss Scenarios**
User data will be lost if:
- Browser cache is cleared
- User uses "Clear browsing data"
- User uses incognito/private mode
- Browser is uninstalled
- Different browser is used
- Different device is used

### 3. **No Server Backup**
- No database backend
- No API endpoints
- No data synchronization
- No export functionality (yet)

### 4. **Security Considerations**
- Data is stored in plain text
- Accessible via JavaScript
- Not encrypted
- Vulnerable to XSS attacks
- Should not store sensitive information

---

## 🔧 Current Implementation

### Feedback Storage (App.jsx)

```javascript
// Load on mount
useEffect(() => {
  const savedFeedback = localStorage.getItem('userFeedback');
  if (savedFeedback) {
    setFeedbackItems(JSON.parse(savedFeedback));
  }
}, []);

// Save on change
useEffect(() => {
  localStorage.setItem('userFeedback', JSON.stringify(feedbackItems));
}, [feedbackItems]);
```

### Use Case Registry (UseCaseRegistry.jsx)

```javascript
// Currently only in component state
const [useCases, setUseCases] = useState([
  // Sample data - NOT persisted
]);
```

---

## 📊 Data Flow Diagram

```
User Input (Form)
       ↓
React Component State
       ↓
localStorage.setItem()
       ↓
Browser localStorage
       ↓
(Page Refresh)
       ↓
localStorage.getItem()
       ↓
React Component State
       ↓
Display to User
```

---

## 🚀 Recommended Improvements

### Priority 1: Add Use Case Registry Persistence

**File:** `src/components/UseCaseRegistry.jsx`

Add localStorage persistence:

```javascript
// Load use cases on mount
useEffect(() => {
  const savedUseCases = localStorage.getItem('useCases');
  if (savedUseCases) {
    setUseCases(JSON.parse(savedUseCases));
  }
}, []);

// Save use cases on change
useEffect(() => {
  localStorage.setItem('useCases', JSON.stringify(useCases));
}, [useCases]);
```

### Priority 2: Add Export Functionality

Allow users to export their data:

```javascript
const exportData = () => {
  const data = {
    feedback: JSON.parse(localStorage.getItem('userFeedback') || '[]'),
    useCases: JSON.parse(localStorage.getItem('useCases') || '[]'),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-metrics-data-${Date.now()}.json`;
  a.click();
};
```

### Priority 3: Add Import Functionality

Allow users to import previously exported data:

```javascript
const importData = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      localStorage.setItem('userFeedback', JSON.stringify(data.feedback));
      localStorage.setItem('useCases', JSON.stringify(data.useCases));
      window.location.reload(); // Reload to update state
    } catch (error) {
      alert('Invalid file format');
    }
  };
  reader.readAsText(file);
};
```

### Priority 4: Add Backend Storage (Future)

For production use, consider:

1. **Database Options:**
   - PostgreSQL
   - MongoDB
   - DynamoDB (AWS)
   - Firebase

2. **API Endpoints:**
   ```
   POST   /api/feedback          - Create feedback
   GET    /api/feedback          - List all feedback
   POST   /api/usecases          - Create use case
   GET    /api/usecases          - List all use cases
   PUT    /api/usecases/:id      - Update use case
   DELETE /api/usecases/:id      - Delete use case
   ```

3. **Authentication:**
   - JWT tokens
   - OAuth 2.0
   - AWS Cognito

---

## 🧹 Data Management

### Clear All Data

```javascript
// Clear specific data
localStorage.removeItem('userFeedback');
localStorage.removeItem('useCases');

// Clear all localStorage
localStorage.clear();
```

### View Data Size

```javascript
// Calculate localStorage usage
const calculateStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return (total / 1024).toFixed(2) + ' KB';
};

console.log('Storage used:', calculateStorageSize());
```

---

## 📱 Cross-Device Sync (Not Implemented)

To sync data across devices, you would need:

1. **Backend server** to store data
2. **User authentication** to identify users
3. **API calls** to sync data
4. **Conflict resolution** for simultaneous edits

**Example Flow:**
```
Device A → API → Database ← API ← Device B
```

---

## 🔐 Security Best Practices

### Current State:
- ❌ No encryption
- ❌ No authentication
- ❌ No authorization
- ❌ No data validation
- ❌ No XSS protection

### Recommendations:
1. **Don't store sensitive data** in localStorage
2. **Sanitize user input** before storing
3. **Implement CSP headers** to prevent XSS
4. **Add backend authentication** for production
5. **Encrypt sensitive data** if necessary

---

## 📋 Data Schema

### Feedback Entry
```typescript
interface FeedbackEntry {
  id: number;              // Timestamp-based ID
  pageName: string;        // Dashboard name
  date: string;            // Submission date (YYYY-MM-DD)
  name: string;            // User name (optional)
  email: string;           // User email (optional)
  details: string;         // Feedback text (required)
  timestamp: string;       // ISO 8601 timestamp
}
```

### Use Case Entry (Future)
```typescript
interface UseCase {
  id: string;              // Unique identifier
  name: string;            // Use case name
  status: string;          // Production/Pilot/Development
  businessContext: object; // Section 1 data
  successMetrics: object;  // Section 2 data
  kpis: array;            // KPI table data
  // ... other sections
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

---

## 🎯 Quick Reference

| Data Type | Storage Location | Persisted? | Shared? | Backed Up? |
|-----------|-----------------|------------|---------|------------|
| Feedback | localStorage | ✅ Yes | ❌ No | ❌ No |
| Use Cases | Component State | ❌ No | ❌ No | ❌ No |
| Login State | Component State | ❌ No | ❌ No | ❌ No |
| Active Tab | Component State | ❌ No | ❌ No | ❌ No |

---

## 📞 FAQ

**Q: Where is my feedback stored?**  
A: In your browser's localStorage under the key `userFeedback`.

**Q: Can other users see my feedback?**  
A: No, it's only stored in your browser.

**Q: What happens if I clear my browser cache?**  
A: All feedback data will be lost.

**Q: Can I access my data on another device?**  
A: No, localStorage is device-specific.

**Q: Is my data backed up?**  
A: No, there's no server backup currently.

**Q: How do I export my data?**  
A: Currently not implemented. See "Recommended Improvements" section.

**Q: Is my data encrypted?**  
A: No, it's stored as plain text in localStorage.

---

**Last Updated:** January 25, 2026  
**Version:** 1.6.0
