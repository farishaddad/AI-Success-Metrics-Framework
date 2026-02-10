#!/bin/bash

# Load environment for new account
if [ -f .env.account-444 ]; then
    export $(cat .env.account-444 | grep -v '^#' | xargs)
fi

echo "🤖 Starting WeatherBot with AWS Account: 444165144454"
echo "   Profile: $AWS_PROFILE"
echo "   Region: $AWS_REGION"
echo ""

# Verify connection
if aws sts get-caller-identity --profile $AWS_PROFILE &> /dev/null; then
    ACCOUNT=$(aws sts get-caller-identity --profile $AWS_PROFILE --query 'Account' --output text)
    echo "✅ Connected to AWS Account: $ACCOUNT"
else
    echo "❌ Cannot connect to AWS"
    exit 1
fi

echo ""
echo "🚀 Starting development server on http://localhost:8080"
echo "   Press Ctrl+C to stop"
echo ""

python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
