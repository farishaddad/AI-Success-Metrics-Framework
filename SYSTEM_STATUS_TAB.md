# System Status Tab - Documentation

## Overview

A new **System Status** tab has been added to the AI Success Metrics Dashboard to provide real-time monitoring of application health and performance metrics.

## Features

### 1. Server Status Monitoring

**Backend Server Card:**
- Real-time status indicator (Online/Offline/Checking)
- Response time measurement in milliseconds
- API endpoint display
- Last check timestamp
- Manual refresh button
- Auto-refresh every 10 seconds

**Frontend Application Card:**
- Application status (always online when viewing)
- Page load time
- Network connection type
- Port information
- Manual refresh button

**Database Card:**
- Database type (JSON/lowdb)
- Number of feedback items stored
- Number of use cases stored
- Database file location
- Manual refresh button
- Auto-refresh every 30 seconds

### 2. Performance Metrics

**Memory Usage:**
- Visual bar chart showing memory consumption
- Used memory vs. total memory vs. limit
- Color-coded indicator (blue = normal, red = high usage)
- Real-time memory statistics in MB

**API Response Time:**
- Large display of current response time
- Performance rating:
  - ✓ Excellent: < 100ms (green)
  - ⚠ Good: 100-300ms (orange)
  - ✕ Slow: > 300ms (red)

**Data Storage:**
- Visual display of stored items
- Feedback items count with icon
- Use cases count with icon

### 3. System Information

Displays comprehensive browser and system details:
- Browser version
- Operating system platform
- Language settings
- Online/offline status
- Screen resolution
- Viewport dimensions

### 4. Auto-Refresh

The dashboard automatically updates:
- Backend health check: Every 10 seconds
- Database statistics: Every 30 seconds
- Visual indicator at bottom of page

## Technical Implementation

### Files Created

1. **src/components/SystemStatusDashboard.jsx**
   - Main component with status monitoring logic
   - Uses React hooks for state management
   - Implements polling for real-time updates
   - Fetches data from backend API

2. **src/components/SystemStatusDashboard.css**
   - Responsive grid layout
   - AWS Design System colors
   - Status indicators and animations
   - Mobile-friendly design

### Files Modified

1. **src/constants/tabs.js**
   - Added 'system' tab configuration

2. **src/App.jsx**
   - Imported SystemStatusDashboard component
   - Added System Status tab button
   - Added conditional rendering for system tab

## API Endpoints Used

The System Status tab uses the following API endpoints:

- `GET /api/health` - Backend health check
- `GET /api/feedback` - Retrieve feedback count
- `GET /api/usecases` - Retrieve use cases count

## Browser APIs Used

- **Performance API**: Page load time and memory usage
- **Navigator API**: Browser info, platform, connection type
- **Fetch API**: Backend communication

## Usage

1. Navigate to the **System Status** tab in the dashboard
2. View real-time status of all system components
3. Monitor performance metrics
4. Use refresh buttons for manual updates
5. Check system information for debugging

## Benefits

### For Administrators:
- Quick health check of entire system
- Performance monitoring at a glance
- Early detection of issues
- Database statistics tracking

### For Developers:
- Real-time API response times
- Memory usage monitoring
- Browser compatibility information
- Network connection details

### For Support:
- System information for troubleshooting
- Status indicators for quick diagnosis
- Performance metrics for optimization

## Color Coding

Following AWS Design System:
- **Green (#1D8102)**: Online/Healthy/Excellent
- **Orange (#FF9900)**: Warning/Good
- **Red (#D13212)**: Offline/Error/Slow
- **Blue (#0073BB)**: Primary actions and metrics
- **Gray (#687078)**: Neutral/Checking

## Responsive Design

The dashboard is fully responsive:
- Desktop: 3-column grid layout
- Tablet: 2-column grid layout
- Mobile: Single column layout

## Future Enhancements

Potential additions:
- Historical performance graphs
- Alert notifications for downtime
- Export system reports
- API request logs
- Error tracking dashboard
- Uptime percentage calculation
- Performance trends over time

## Testing

To verify the System Status tab is working:

1. **Backend Online Test:**
   - Ensure backend server is running
   - Navigate to System Status tab
   - Backend card should show "ONLINE" with green indicator

2. **Backend Offline Test:**
   - Stop the backend server
   - Wait 10 seconds for auto-refresh
   - Backend card should show "OFFLINE" with red indicator

3. **Performance Test:**
   - Check memory usage bar
   - Verify response time is displayed
   - Confirm data storage counts are accurate

4. **Manual Refresh Test:**
   - Click refresh buttons on each card
   - Verify data updates immediately

## Troubleshooting

**Backend shows offline:**
- Check if backend server is running on port 3001
- Verify `.env` file has correct `VITE_API_URL`
- Check browser console for CORS errors

**Memory usage not showing:**
- Some browsers don't support `performance.memory`
- This is normal for Safari and Firefox
- Chrome/Edge will show memory metrics

**Response time seems high:**
- Check network connection
- Verify backend server isn't overloaded
- Consider optimizing API endpoints

## Conclusion

The System Status tab provides comprehensive monitoring capabilities for the AI Success Metrics Dashboard, enabling administrators and developers to quickly assess system health and performance in real-time.
