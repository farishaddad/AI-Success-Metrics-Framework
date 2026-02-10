# AI Success Metrics Dashboard

A comprehensive React-based dashboard system for tracking and visualizing AI program success metrics across multiple dimensions, built with AWS Design System specifications. Now includes integrated AI Agent Demo with real-time chat and metrics collection.

## Features

### 10 Specialized Dashboards

1. **Executive Overview** - High-level health score, ROI, cost savings, and strategic alignment
2. **Business Impact** - Revenue growth, market share, time-to-market, and innovation metrics
3. **Operational Efficiency** - Process optimization, error reduction, productivity gains
4. **Model Performance** - Technical metrics, classification performance, GenAI metrics, fairness analysis
5. **Customer Experience** - CSAT, NPS, resolution metrics, churn analysis
6. **Innovation Capacity** - Innovation velocity, workforce upskilling, market adaptation
7. **Economic Efficiency** - ROI analysis, cost breakdown, payback timelines
8. **ROI Tracking** - Detailed ROI by four pillars (Efficiency, Revenue, Risk, Agility)
9. **Project Details** - Project-level drill-down with lifecycle, costs, and performance
10. **🤖 Agent Demo** - Interactive AI agent with real-time chat, metrics tracking, and performance analytics

### New: AI Agent Demo Integration

The Agent Demo tab provides a complete AI agent experience with:

- **Real-time Chat Interface** - Interactive chat with streaming responses
- **Live Metrics Collection** - Automatic tracking of performance, cost, and token usage
- **Visual Analytics** - Charts and graphs showing agent performance over time
- **Session Management** - Track individual conversations and invocations
- **Cost Tracking** - Real-time cost calculation based on token usage
- **Performance Monitoring** - Response times, success rates, and error tracking

#### Agent Demo Features

**Chat Interface:**
- Streaming responses with typing indicators
- Session-based conversation tracking
- Example prompts for quick testing
- Error handling and retry logic
- Message history with timestamps

**Metrics Dashboard:**
- Total invocations and success rate
- Average response time and cost per invocation
- Token usage (input/output) tracking
- Tool call monitoring
- Hourly breakdown charts
- Recent invocations table with detailed information

**Technical Capabilities:**
- Code execution (Python, JavaScript, TypeScript)
- Web search integration
- Company research
- Code research and documentation lookup
- General Q&A and problem-solving

## AWS Design System

### Color Palette

```css
Primary: #0073BB (AWS Blue)
Success: #1D8102 (Green)
Warning: #FF9900 (Orange)
Danger: #D13212 (Red)
Neutral: #687078 (Gray)
Background: #FFFFFF (White)
Secondary Background: #F2F3F3 (Light Gray)
```

### Typography

- **Headers**: 24px, Bold, Primary color
- **Sub-headers**: 18px, Semi-bold, Neutral color
- **Body**: 14px, Regular, Neutral color
- **KPI Numbers**: 36-48px, Bold, Context color
- **Labels**: 12px, Regular, Neutral color

### Chart Specifications

- **Grid lines**: Light gray (#E5E7EB), 1px, dashed
- **Axis labels**: 12px, Neutral color
- **Legends**: Bottom or right, 12px
- **Tooltips**: White background, shadow, 14px text
- **Animations**: 300ms ease-in-out transitions

### Responsive Behavior

- **Desktop (>1200px)**: Full layout with 2-4 column grids
- **Tablet (768-1200px)**: 2-column grid, stacked sections
- **Mobile (<768px)**: Single column, scrollable cards

### Interactivity

- **Hover**: Subtle shadow and transform effects (translateY -2px)
- **Transitions**: 300ms ease-in-out for all interactive elements
- **Color Feedback**: Context-aware colors (success, warning, danger)

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Recharts 2.10** - Data visualization library
- **Vite 5** - Build tool and dev server
- **CSS Variables** - Design system implementation

### Backend
- **Node.js + Express** - REST API server
- **LowDB** - JSON-based database for development
- **JWT Authentication** - Secure user authentication
- **Rate Limiting** - API protection
- **Helmet** - Security headers

### AI Agent
- **AWS Bedrock AgentCore** - Agent runtime framework
- **Claude Sonnet 4.5** - LLM model (via AWS Bedrock)
- **Python 3.14** - Agent implementation
- **FastAPI/Uvicorn** - Agent API server
- **MCP (Model Context Protocol)** - Tool integration

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│                   http://localhost:3000                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Dashboards  │  Agent Demo  │  User Management      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express)                      │
│                   http://localhost:3001                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Auth  │  Feedback  │  Use Cases  │  Agent Metrics  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          ↓                                  │
│                   LowDB (db.json)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Metrics Collection
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  AI Agent (Python)                          │
│                   http://localhost:8081                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BedrockAgentCore  │  Claude Sonnet 4.5  │  MCP     │  │
│  │  Code Interpreter  │  Metrics Middleware │  CORS    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          ↓                                  │
│                   AWS Bedrock API                          │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.14+ (for AI Agent)
- AWS Account with Bedrock access (for AI Agent)
- AWS CLI configured with credentials

### Installation

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
cd ..
```

3. **Install AI Agent Dependencies**
```bash
cd WeatherBot
pip3 install -e .
cd ..
```

4. **Configure Environment Variables**

Create `.env` file in root:
```bash
VITE_API_URL=http://localhost:3001/api
```

Create `server/.env`:
```bash
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:3000
```

Create `WeatherBot/.env`:
```bash
AWS_REGION=us-east-1
AWS_PROFILE=your-aws-profile
DASHBOARD_API_URL=http://localhost:3001/api
```

### Running the Application

**Option 1: Start All Services Individually**

```bash
# Terminal 1 - Backend API
cd server
npm start

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - AI Agent
cd WeatherBot
bash start_with_metrics.sh
```

**Option 2: Use the Start Script**

```bash
# Start everything at once
./START_DASHBOARD.sh
```

### Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **AI Agent**: http://localhost:8081

### Default Login Credentials

```
Username: admin
Password: Admin@2026!
```

⚠️ **Change the default password after first login!**

## Project Structure

```
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── Dashboard.jsx                    # Executive Overview
│   │   ├── BusinessImpactDashboard.jsx
│   │   ├── OperationalEfficiencyDashboard.jsx
│   │   ├── ModelPerformanceDashboard.jsx
│   │   ├── CustomerExperienceDashboard.jsx
│   │   ├── InnovationCapacityDashboard.jsx
│   │   ├── EconomicEfficiencyDashboard.jsx
│   │   ├── ROITrackingDashboard.jsx
│   │   ├── ProjectLevelDashboard.jsx
│   │   ├── AgentMetricsDashboard.jsx        # Agent Demo Dashboard
│   │   ├── AgentChatInterface.jsx           # Chat Interface
│   │   ├── LoginPage.jsx                    # Authentication
│   │   ├── UserManagement.jsx               # Admin Panel
│   │   └── [various panel components]
│   ├── services/
│   │   ├── api.js                # API client
│   │   ├── authService.js        # Authentication
│   │   └── userService.js        # User management
│   ├── utils/
│   │   └── chartConfig.js        # Shared chart configuration
│   ├── App.jsx                   # Main app with tab navigation
│   ├── App.css                   # App-level styles
│   └── index.css                 # Global styles & design system
├── server/                       # Backend API
│   ├── auth/
│   │   ├── authService.js        # Authentication logic
│   │   └── authMiddleware.js     # JWT middleware
│   ├── database/
│   │   ├── db.js                 # Database operations
│   │   └── db.json               # JSON database
│   ├── middleware/
│   │   ├── rateLimiter.js        # Rate limiting
│   │   ├── security.js           # Security headers
│   │   └── validation.js         # Input validation
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── userRoutes.js         # User endpoints
│   ├── db-simple.js              # Database wrapper
│   └── server-simple.js          # Express server
└── WeatherBot/                   # AI Agent
    ├── src/
    │   ├── main.py               # Agent entrypoint
    │   ├── model/
    │   │   └── load.py           # Model configuration
    │   ├── middleware/
    │   │   └── metrics.py        # Metrics collection
    │   └── mcp_client/
    │       └── client.py         # MCP integration
    ├── .env                      # Agent configuration
    └── start_with_metrics.sh     # Startup script
```

## Design System Usage

### Using CSS Variables

All components use CSS variables defined in `index.css`:

```css
var(--aws-primary)      /* #0073BB */
var(--aws-success)      /* #1D8102 */
var(--aws-warning)      /* #FF9900 */
var(--aws-danger)       /* #D13212 */
var(--aws-neutral)      /* #687078 */
var(--aws-bg-primary)   /* #FFFFFF */
var(--aws-bg-secondary) /* #F2F3F3 */
```

### Chart Configuration

Import shared chart configuration:

```javascript
import { AWS_COLORS, CHART_COLORS, CHART_STYLES } from '../utils/chartConfig';
```

### Responsive Components

All panels include hover effects and responsive behavior:

```css
.panel:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

## Dashboard Details

### 1. Executive Overview
- AI Program Health Score (0-100 gauge)
- Overall AI ROI with trend sparkline
- Cost Savings Summary (stacked bar chart)
- Project Portfolio Status (donut chart)
- Strategic Alignment Score (bullet charts)

### 2. Business Impact
- Four KPI cards (Revenue Growth, Market Share, Time-to-Market, Innovation Index)
- Revenue Attribution (waterfall chart)
- Time-to-Market Comparison (grouped bar chart)

### 3. Operational Efficiency
- Process Cycle Time (line chart with dual axis)
- Error Rate Reduction (area chart)
- Productivity Gains (bar chart with target line)
- Cost per Transaction (combo chart)
- Task-Level ROI Table (sortable data table)

### 4. Model Performance
- Model Health Overview (status grid)
- Classification Metrics (radar chart)
- GenAI Specific Metrics (gauge cluster)
- Performance Under Load (scatter plot)
- Fairness & Bias Metrics (heatmap)

### 5. Customer Experience
- Primary CX Metrics (CSAT, NPS, Resolution Time cards)
- Resolution Funnel (funnel chart)
- Churn Analysis (line chart with annotations)
- Customer Retention Cohort (heatmap)

### 6. Innovation Capacity
- Innovation Velocity (combo chart)
- Workforce Upskilling (progress bars)
- Market Adaptation Speed (timeline/Gantt)
- Innovation Pipeline (Kanban board)

### 7. Economic Efficiency
- Financial KPIs (ROI, TCO, Payback Period, LCOAI)
- ROI by Four Pillars (stacked bar chart)
- Cost Breakdown (bar chart)
- Payback Timeline (area chart)

### 8. ROI Tracking
- Tabbed interface with four pillars
- Detailed charts for each pillar
- Comprehensive ROI analysis

### 9. Project Details
- Project selector dropdown
- Lifecycle timeline visualization
- Baseline metrics comparison table
- Cost analysis area chart
- Business impact scorecard
- Model performance time series

### 10. 🤖 Agent Demo (NEW)
- **Interactive Chat Interface**
  - Real-time streaming responses
  - Session management
  - Example prompts
  - Message history
  
- **Performance Metrics**
  - Total invocations and success rate
  - Average response time
  - Cost per invocation
  - Token usage tracking
  
- **Visual Analytics**
  - Invocations over time (line chart)
  - Cost over time (bar chart)
  - Success vs failures (pie chart)
  - Token distribution (pie chart)
  - Recent invocations table
  
- **Cost Breakdown**
  - Input tokens cost
  - Output tokens cost
  - Total cost tracking
  
- **Performance Insights**
  - Average tokens per invocation
  - Performance score
  - Cost efficiency
  - Reliability metrics

## Component Guidelines

### Panel Component

- Use `.panel` class for consistent styling
- Include `.panel-title` for headers (24px, bold, primary color)
- Add hover effects for interactivity
- Ensure responsive padding (24px desktop, 16px mobile)

### KPI Cards

- Display large numbers (36-48px) with context colors
- Include comparison indicators (positive/negative)
- Show trend sparklines where applicable
- Use icon containers with background colors

### Charts

- Apply consistent grid styling (dashed, light gray)
- Use AWS color palette for data series
- Include tooltips with white background and shadow
- Ensure legends are positioned bottom or right
- Add 300ms transitions for animations

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/reset-password` - Reset password

### Feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback
- `DELETE /api/feedback/:id` - Delete feedback

### Use Cases
- `GET /api/usecases` - Get all use cases
- `POST /api/usecases` - Create use case
- `GET /api/usecases/:id` - Get use case details

### Agent Metrics (NEW)
- `GET /api/agent-metrics` - Get all metrics
- `POST /api/agent-metrics` - Create metric entry
- `GET /api/agent-metrics/summary` - Get metrics summary
- `GET /api/agent-metrics/session/:id` - Get session metrics

### Agent Invocation
- `POST http://localhost:8081/invocations` - Invoke AI agent

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Controlled origins
- **Security Headers** - Helmet.js implementation
- **Input Validation** - XSS and injection prevention
- **Role-Based Access** - Admin and Guest roles

## Monitoring & Observability

### Agent Metrics Collection

The system automatically collects:
- **Performance**: Response time, latency
- **Cost**: Token usage and pricing
- **Quality**: Success rate, error tracking
- **Usage**: Invocation count, session tracking
- **Tools**: Tool call frequency and success

### Metrics Storage

- Stored in LowDB (JSON file)
- Queryable via REST API
- Time-range filtering support
- Hourly aggregation

## Troubleshooting

### Agent Not Starting
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify Bedrock access
aws bedrock list-foundation-models --region us-east-1

# Check Python dependencies
cd WeatherBot
pip3 list | grep bedrock
```

### CORS Errors
- Ensure agent server has CORS middleware enabled
- Check `WeatherBot/src/main.py` for CORS configuration
- Verify frontend origin is allowed

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in server/.env
- Verify user exists in database

### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :8081  # Agent

# Kill process if needed
kill -9 <PID>
```

## Documentation

- `AGENT_METRICS_QUICK_START.md` - Agent setup guide
- `AGENT_CHAT_INTEGRATION_COMPLETE.md` - Chat integration details
- `AUTHENTICATION_COMPLETE.md` - Auth system guide
- `DATABASE_SETUP.md` - Database configuration
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `TROUBLESHOOTING.md` - Common issues and solutions

## Future Enhancements

- [ ] Global date range filters
- [ ] Project and department filters
- [ ] PDF/Excel export functionality
- [ ] Auto-refresh every 5 minutes
- [ ] Drill-down detail views
- [ ] Real-time data integration via WebSockets
- [ ] User preferences and saved views
- [ ] Dark mode support
- [ ] Multi-agent support in Agent Demo
- [ ] Agent conversation history export
- [ ] Advanced agent analytics and insights
- [ ] Custom agent tool integration
- [ ] Agent performance benchmarking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- All charts use `ResponsiveContainer` for fluid layouts
- Transitions limited to 300ms for smooth performance
- Mock data generation optimized for quick rendering
- Component-level error boundaries for graceful failures
- Agent responses stream for better UX
- Metrics collection runs asynchronously

## License

MIT

---

## Quick Links

- [Agent Metrics Quick Start](AGENT_METRICS_QUICK_START.md)
- [Authentication Guide](AUTHENTICATION_COMPLETE.md)
- [Database Setup](DATABASE_SETUP.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Troubleshooting](TROUBLESHOOTING.md)

## Support

For issues, questions, or contributions, please refer to the documentation files or create an issue in the repository.
