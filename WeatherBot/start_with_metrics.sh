#!/bin/bash

# Start WeatherBot with metrics collection enabled

echo "🤖 Starting WeatherBot with Metrics Collection"
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded environment from .env"
else
    echo "⚠️  No .env file found, using defaults"
    export DASHBOARD_API_URL="http://localhost:3001/api"
    export AWS_REGION="us-east-1"
fi

echo "   Dashboard API: $DASHBOARD_API_URL"
echo "   AWS Region: $AWS_REGION"
echo "   AWS Profile: ${AWS_PROFILE:-default}"
echo ""

# Verify dashboard is accessible
if curl -s "$DASHBOARD_API_URL/../health" > /dev/null 2>&1; then
    echo "✅ Dashboard backend is accessible"
else
    echo "⚠️  Warning: Cannot reach dashboard backend at $DASHBOARD_API_URL"
    echo "   Metrics will not be sent, but agent will still work"
fi

echo ""
echo "🚀 Starting agent server on http://localhost:8080"
echo "   Press Ctrl+C to stop"
echo ""

# Start the server
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8081 --reload
