# Design: AI Agent Demo Integration

## Overview

This document describes the technical design for integrating an AI agent demonstration feature into the AI Success Metrics Dashboard, including architecture, components, data models, and implementation details.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AgentMetricsDashboard.jsx                             │ │
│  │  ├── AgentChatInterface.jsx (Chat UI)                 │ │
│  │  ├── Metrics Visualization (Charts)                   │ │
│  │  └── KPI Cards                                        │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ├─── POST /invocations (Agent)
                     │
                     └─── GET/POST /api/agent-metrics (Backend)
                     │
┌────────────────────▼───────────────────────────────────────┐
│                Backend API (Express)                        │
│  ┌────────────────────────────────────────────────────────┐│
│  │  Routes:                                               ││
│  │  - GET /api/agent-metrics                             ││
│  │  - POST /api/agent-metrics                            ││
│  │  - GET /api/agent-metrics/summary                     ││
│  │  - GET /api/agent-metrics/session/:id                 ││
│  └────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────┐│
│  │  Database (LowDB)                                      ││
│  │  - agentMetrics collection                            ││
│  └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│                AI Agent Server (Python)                     │
│  ┌────────────────────────────────────────────────────────┐│
│  │  BedrockAgentCore Runtime                              ││
│  │  ├── CORS Middleware                                   ││
│  │  ├── Metrics Middleware                                ││
│  │  ├── Agent Entrypoint                                  ││
│  │  └── Streaming Handler                                 ││
│  └────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────┐│
│  │  AWS Bedrock API                                       ││
│  │  └── Claude Sonnet 4.5                                 ││
│  └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

## Component Design

### Frontend Components

#### 1. AgentMetricsDashboard.jsx

**Purpose**: Main container for agent demo features

**State Management**:
```javascript
{
  summary: object | null,           // Aggregated metrics
  recentMetrics: array,             // Recent invocations
  loading: boolean,                 // Loading state
  timeRange: string,                // '1h' | '24h' | '7d' | '30d'
  error: string | null,             // Error message
  showChat: boolean                 // Chat visibility toggle
}
```

**Key Functions**:
- `loadMetrics()`: Fetch metrics from API
- `formatCurrency()`: Format cost values
- `formatNumber()`: Format numeric values
- `formatDuration()`: Format milliseconds to readable time

**Child Components**:
- AgentChatInterface
- KPI Cards (6 cards)
- Charts (4 charts)
- Recent Invocations Table
- Cost Breakdown Panel
- Performance Insights

**Props**:
- `onFeedbackSubmit`: Callback for feedback submission

#### 2. AgentChatInterface.jsx

**Purpose**: Interactive chat interface with streaming responses

**State Management**:
```javascript
{
  messages: array,                  // Chat history
  input: string,                    // Current input
  isLoading: boolean,               // Processing state
  sessionId: string,                // Unique session ID
  error: string | null              // Error message
}
```

**Key Functions**:
- `sendMessage()`: Send message to agent
- `handleKeyPress()`: Handle Enter key
- `clearChat()`: Clear message history
- `scrollToBottom()`: Auto-scroll to latest message

**Message Structure**:
```javascript
{
  role: 'user' | 'assistant' | 'error',
  content: string,
  timestamp: string (ISO 8601),
  isStreaming: boolean (optional)
}
```

**Props**:
- `agentUrl`: Agent endpoint URL
- `onMetricsUpdate`: Callback to refresh metrics

### Backend Components

#### 1. Agent Metrics API Routes

**Endpoints**:

```javascript
// Get all metrics
GET /api/agent-metrics
Response: Array<AgentMetric>

// Create metric entry
POST /api/agent-metrics
Body: AgentMetric
Response: AgentMetric

// Get summary
GET /api/agent-metrics/summary?startDate=...&endDate=...
Response: MetricsSummary

// Get session metrics
GET /api/agent-metrics/session/:sessionId
Response: Array<AgentMetric>
```

#### 2. Database Layer (agentMetricsDB)

**Operations**:
- `getAll()`: Retrieve all metrics
- `create(data)`: Create new metric entry
- `getBySessionId(sessionId)`: Filter by session
- `getSummary(startDate, endDate)`: Aggregate metrics
- `delete(id)`: Remove metric entry

**Aggregation Logic**:
```javascript
{
  total_invocations: count,
  successful_invocations: count,
  failed_invocations: count,
  total_cost: sum,
  avg_duration_ms: average,
  total_input_tokens: sum,
  total_output_tokens: sum,
  avg_input_tokens: average,
  avg_output_tokens: average,
  total_tool_calls: sum,
  unique_sessions: count(distinct),
  success_rate: percentage,
  hourly_breakdown: array
}
```

### Agent Components

#### 1. Main Agent (main.py)

**Structure**:
```python
@app.middleware("http")
async def add_cors_headers(request, call_next):
    # Handle OPTIONS preflight
    # Add CORS headers
    
@app.entrypoint
async def invoke(payload, context):
    # Start metrics collection
    # Create agent with tools
    # Stream responses
    # Track token usage
    # End metrics collection
```

**CORS Configuration**:
- Allow all origins (`*`)
- Support OPTIONS preflight
- Include proper headers

#### 2. Metrics Middleware (metrics.py)

**MetricsCollector Class**:

```python
class MetricsCollector:
    def start_invocation(session_id, prompt):
        # Generate invocation ID
        # Record start time
        # Return invocation data
        
    def record_token_usage(invocation_id, input_tokens, output_tokens):
        # Calculate cost
        # Update metrics
        
    def record_tool_call(invocation_id, tool_name, duration, success):
        # Track tool usage
        
    def record_error(invocation_id, error_type, error_message):
        # Log error details
        
    def end_invocation(invocation_id, response_length, success):
        # Calculate duration
        # Send to backend API
```

**Pricing Model**:
```python
INPUT_TOKEN_PRICE = 0.003 / 1000   # $0.003 per 1K tokens
OUTPUT_TOKEN_PRICE = 0.015 / 1000  # $0.015 per 1K tokens
```

## Data Models

### AgentMetric

```typescript
interface AgentMetric {
  id: string;                    // UUID
  session_id: string;            // Session identifier
  prompt: string;                // User input
  response_length: number;       // Response character count
  start_timestamp: string;       // ISO 8601
  end_timestamp: string;         // ISO 8601
  duration_ms: number;           // Response time
  tokens_input: number;          // Input tokens
  tokens_output: number;         // Output tokens
  cost_usd: number;              // Calculated cost
  tool_count: number;            // Number of tools used
  tool_calls: ToolCall[];        // Tool usage details
  success: boolean;              // Success flag
  error_type: string | null;     // Error type if failed
  error_message: string | null;  // Error details if failed
}
```

### ToolCall

```typescript
interface ToolCall {
  tool_name: string;             // Tool identifier
  duration_ms: number;           // Execution time
  success: boolean;              // Success flag
  timestamp: string;             // ISO 8601
}
```

### MetricsSummary

```typescript
interface MetricsSummary {
  total_invocations: number;
  successful_invocations: number;
  failed_invocations: number;
  total_cost: number;
  avg_duration_ms: number;
  total_input_tokens: number;
  total_output_tokens: number;
  avg_input_tokens: number;
  avg_output_tokens: number;
  total_tool_calls: number;
  total_errors: number;
  unique_sessions: number;
  first_invocation: string;
  last_invocation: string;
  success_rate: string;          // Percentage
  hourly_breakdown: HourlyMetric[];
}
```

### HourlyMetric

```typescript
interface HourlyMetric {
  hour: string;                  // ISO 8601 hour
  invocations: number;
  cost: number;
  totalDuration: number;
  avg_duration: number;
}
```

## API Design

### Request/Response Formats

#### Agent Invocation

**Request**:
```json
POST /invocations
Content-Type: application/json

{
  "prompt": "Hello, what can you do?",
  "session_id": "session_1706472000000"
}
```

**Response** (Streaming):
```
data: "Hello! "
data: "I'm a "
data: "helpful assistant..."
```

#### Create Metric

**Request**:
```json
POST /api/agent-metrics
Content-Type: application/json

{
  "session_id": "session_123",
  "prompt": "Calculate 5 + 3",
  "response_length": 150,
  "start_timestamp": "2026-01-29T10:00:00Z",
  "end_timestamp": "2026-01-29T10:00:03Z",
  "duration_ms": 3000,
  "tokens_input": 10,
  "tokens_output": 20,
  "cost_usd": 0.00033,
  "tool_count": 1,
  "tool_calls": [...],
  "success": true,
  "error_type": null,
  "error_message": null
}
```

**Response**:
```json
{
  "id": "uuid-here",
  ...same fields as request
}
```

#### Get Summary

**Request**:
```
GET /api/agent-metrics/summary?startDate=2026-01-28T00:00:00Z&endDate=2026-01-29T00:00:00Z
```

**Response**:
```json
{
  "total_invocations": 150,
  "successful_invocations": 145,
  "failed_invocations": 5,
  "total_cost": 0.495,
  "avg_duration_ms": 2500,
  "total_input_tokens": 1500,
  "total_output_tokens": 3000,
  "avg_input_tokens": 10,
  "avg_output_tokens": 20,
  "total_tool_calls": 75,
  "total_errors": 5,
  "unique_sessions": 25,
  "first_invocation": "2026-01-28T10:00:00Z",
  "last_invocation": "2026-01-29T09:59:59Z",
  "success_rate": "96.67",
  "hourly_breakdown": [...]
}
```

## UI/UX Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Dashboard Header                                         │
│ ├── Title: "🤖 Agent Performance Metrics"              │
│ ├── Toggle Chat Button                                  │
│ ├── Time Range Selector                                 │
│ └── Refresh Button                                      │
├─────────────────────────────────────────────────────────┤
│ Chat Section (Collapsible)                              │
│ ├── Chat Header (Agent Name, Session ID)               │
│ ├── Messages Area (Scrollable)                         │
│ ├── Input Field                                         │
│ └── Send Button                                         │
├─────────────────────────────────────────────────────────┤
│ KPI Cards Grid (6 cards)                                │
│ ├── Total Invocations                                   │
│ ├── Total Cost                                          │
│ ├── Avg Response Time                                   │
│ ├── Success Rate                                        │
│ ├── Tool Calls                                          │
│ └── Total Tokens                                        │
├─────────────────────────────────────────────────────────┤
│ Charts Section                                           │
│ ├── Invocations Over Time (Line Chart)                 │
│ ├── Cost Over Time (Bar Chart)                         │
│ ├── Success vs Failures (Pie Chart)                    │
│ └── Token Distribution (Pie Chart)                     │
├─────────────────────────────────────────────────────────┤
│ Recent Invocations Table                                 │
│ └── Columns: Timestamp, Session, Prompt, Duration,     │
│              Tokens, Cost, Tools, Status                │
├─────────────────────────────────────────────────────────┤
│ Cost Breakdown Panel                                     │
│ └── Input Cost, Output Cost, Total Cost                │
├─────────────────────────────────────────────────────────┤
│ Performance Insights Grid (4 cards)                      │
│ └── Avg Tokens, Performance Score, Cost Efficiency,    │
│     Reliability                                          │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme

**Status Colors**:
- Success: `#00C49F` (Green)
- Failed: `#FF8042` (Red)
- Warning: `#FFBB28` (Yellow)
- Info: `#0088FE` (Blue)
- Neutral: `#8884D8` (Purple)

**Chart Colors**:
```javascript
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
```

### Responsive Breakpoints

```css
/* Desktop: > 1200px */
- Full layout with 2-column charts
- All features visible

/* Tablet: 768px - 1200px */
- Single column charts
- Stacked sections

/* Mobile: < 768px */
- Single column layout
- Collapsible sections
- Touch-optimized controls
```

## Security Design

### Authentication Flow

```
1. User logs in → JWT token issued
2. Token stored in localStorage
3. Frontend includes token in API requests
4. Backend validates token
5. Agent metrics endpoints: No auth required (internal)
```

### CORS Configuration

**Frontend Origins**:
- `http://localhost:3000`
- `http://localhost:5173`
- Production domain (configurable)

**Agent CORS**:
```python
@app.middleware("http")
async def add_cors_headers(request, call_next):
    if request.method == "OPTIONS":
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        )
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response
```

### Input Validation

**Frontend**:
- Trim whitespace
- Limit message length (10,000 characters)
- Sanitize HTML/scripts

**Backend**:
- Validate required fields
- Type checking
- SQL injection prevention (N/A for JSON DB)
- XSS prevention

## Performance Optimization

### Frontend Optimizations

1. **Debouncing**: Metrics refresh debounced to 30 seconds
2. **Lazy Loading**: Charts load on demand
3. **Memoization**: Expensive calculations cached
4. **Virtual Scrolling**: For large message lists (future)
5. **Code Splitting**: Separate bundle for agent demo

### Backend Optimizations

1. **Indexing**: Session ID and timestamp indexed
2. **Caching**: Summary results cached for 30 seconds
3. **Pagination**: Limit results to 100 recent metrics
4. **Aggregation**: Pre-calculate hourly summaries
5. **Connection Pooling**: Reuse database connections

### Agent Optimizations

1. **Streaming**: Immediate response start
2. **Async Processing**: Non-blocking operations
3. **Connection Reuse**: HTTP keep-alive
4. **Timeout Handling**: 30-second timeout
5. **Resource Cleanup**: Proper session management

## Error Handling

### Error Types

1. **Network Errors**: Connection failures, timeouts
2. **Authentication Errors**: Invalid/expired tokens
3. **Validation Errors**: Invalid input data
4. **Agent Errors**: Model failures, tool errors
5. **Database Errors**: Write/read failures

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...},
  "timestamp": "2026-01-29T10:00:00Z"
}
```

### User-Facing Messages

- Network Error: "Unable to connect. Please check your connection."
- Agent Error: "The agent encountered an error. Please try again."
- Validation Error: "Invalid input. Please check your message."
- Auth Error: "Session expired. Please log in again."

## Testing Strategy

### Unit Tests

**Frontend**:
- Component rendering
- State management
- Event handlers
- Utility functions

**Backend**:
- API endpoints
- Database operations
- Authentication
- Validation logic

**Agent**:
- Metrics collection
- Cost calculation
- CORS handling
- Error handling

### Integration Tests

- Frontend ↔ Backend API
- Backend ↔ Database
- Backend ↔ Agent
- End-to-end user flows

### Performance Tests

- Load testing (100 concurrent users)
- Stress testing (sustained load)
- Response time benchmarks
- Memory leak detection

## Deployment Strategy

### Development

```bash
# Start all services
./START_DASHBOARD.sh

# Or individually:
cd server && npm start          # Backend
npm run dev                     # Frontend
cd WeatherBot && bash start_with_metrics.sh  # Agent
```

### Production

**Frontend**:
- Build: `npm run build`
- Deploy to: AWS S3 + CloudFront / Netlify / Vercel
- Enable HTTPS
- Configure CDN

**Backend**:
- Deploy to: AWS ECS / Fargate / EC2
- Environment: Production
- Database: Migrate to PostgreSQL/RDS
- Enable monitoring

**Agent**:
- Deploy to: AWS Lambda / EC2
- Configure: Auto-scaling
- Monitoring: CloudWatch
- Logging: Centralized

## Monitoring and Observability

### Metrics to Track

1. **Performance**: Response time, latency, throughput
2. **Availability**: Uptime, error rate
3. **Cost**: Token usage, API costs
4. **Usage**: Invocations, sessions, users
5. **Quality**: Success rate, error types

### Logging

**Log Levels**:
- ERROR: Failures, exceptions
- WARN: Degraded performance, retries
- INFO: Normal operations, metrics
- DEBUG: Detailed debugging info

**Log Format**:
```json
{
  "timestamp": "2026-01-29T10:00:00Z",
  "level": "INFO",
  "service": "agent",
  "message": "Invocation completed",
  "metadata": {
    "session_id": "...",
    "duration_ms": 2500,
    "cost_usd": 0.00033
  }
}
```

### Alerts

- Error rate > 5%
- Response time > 5 seconds
- Cost > $10/hour
- Availability < 99%

## Future Enhancements

### Phase 2 Features

1. **Multi-Agent Support**: Switch between different agents
2. **Conversation Export**: Download chat history
3. **Advanced Analytics**: Deeper insights, trends
4. **Custom Tools**: User-defined tool integration
5. **Voice I/O**: Speech-to-text, text-to-speech

### Phase 3 Features

1. **Real-time Collaboration**: Multi-user sessions
2. **A/B Testing**: Compare agent configurations
3. **Fine-tuning**: Custom model training
4. **Workflow Automation**: Scheduled tasks
5. **Mobile App**: Native iOS/Android apps

---

**Status**: Implemented  
**Version**: 1.0  
**Last Updated**: January 29, 2026  
**Owner**: Development Team
