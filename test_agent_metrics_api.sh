#!/bin/bash

echo "🧪 Testing Agent Metrics API Endpoints"
echo "========================================"
echo ""

# Test 1: Health check
echo "1. Testing health endpoint..."
curl -s http://localhost:3001/api/health
echo -e "\n"

# Test 2: Get summary (should return empty data initially)
echo "2. Testing metrics summary endpoint..."
curl -s http://localhost:3001/api/agent-metrics/summary
echo -e "\n"

# Test 3: Create a test metric
echo "3. Creating test metric..."
curl -s -X POST http://localhost:3001/api/agent-metrics \
  -H "Content-Type: application/json" \
  -d '{
    "invocation_id": "test_123",
    "session_id": "test_session",
    "agent_name": "WeatherBot",
    "model": "claude-sonnet-4.5",
    "prompt": "Test prompt",
    "start_timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "end_timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "duration_ms": 1500,
    "duration_seconds": 1.5,
    "tokens_input": 100,
    "tokens_output": 200,
    "cost_usd": 0.0033,
    "response_length": 500,
    "tool_count": 1,
    "error_count": 0,
    "success": true,
    "tool_calls": [],
    "errors": []
  }'
echo -e "\n"

# Test 4: Get all metrics
echo "4. Getting all metrics..."
curl -s http://localhost:3001/api/agent-metrics
echo -e "\n"

# Test 5: Get summary again (should have data now)
echo "5. Getting summary with data..."
curl -s http://localhost:3001/api/agent-metrics/summary
echo -e "\n"

echo "========================================"
echo "✅ API tests complete!"
