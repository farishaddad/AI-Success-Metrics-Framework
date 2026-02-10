#!/bin/bash

echo "=========================================="
echo "🔍 WeatherBot Connection Test"
echo "=========================================="
echo ""

# Check if server is running
echo "1. Checking if server is running on port 8080..."
if lsof -i :8080 > /dev/null 2>&1; then
    echo "   ✅ Server is running on port 8080"
    lsof -i :8080 | grep LISTEN
else
    echo "   ❌ No server found on port 8080"
    echo ""
    echo "   Start the server with:"
    echo "   ./start_with_new_account.sh"
    echo "   or"
    echo "   python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload"
    exit 1
fi

echo ""

# Test HTTP connection
echo "2. Testing HTTP connection..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}' \
  --max-time 10)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Server responded with HTTP 200"
    echo ""
    echo "   Response:"
    echo "$BODY" | head -c 500
    echo ""
else
    echo "   ❌ Server responded with HTTP $HTTP_CODE"
    echo ""
    echo "   Response:"
    echo "$BODY"
    echo ""
fi

echo ""

# Check AWS credentials
echo "3. Checking AWS credentials..."
if [ -n "$AWS_PROFILE" ]; then
    echo "   Using profile: $AWS_PROFILE"
    aws sts get-caller-identity --profile $AWS_PROFILE 2>&1 | head -5
else
    echo "   Using default credentials"
    aws sts get-caller-identity 2>&1 | head -5
fi

echo ""
echo "=========================================="
echo "To test the agent, run:"
echo "   agentcore invoke --dev 'Hello!'"
echo "=========================================="
