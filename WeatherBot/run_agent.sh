#!/bin/bash

# WeatherBot Agent Startup Script

echo "🤖 Starting WeatherBot Agent..."
echo ""

# Check if AWS credentials are configured
if ! command -v aws &> /dev/null; then
    echo "⚠️  AWS CLI not installed"
    echo "   Install with: brew install awscli"
    echo "   Or visit: https://aws.amazon.com/cli/"
    echo ""
fi

# Check AWS credentials
if command -v aws &> /dev/null; then
    if aws sts get-caller-identity &> /dev/null; then
        echo "✅ AWS credentials configured"
        aws sts get-caller-identity --query 'Account' --output text | xargs -I {} echo "   Account: {}"
    else
        echo "⚠️  AWS credentials not configured"
        echo "   Run: aws configure"
        echo "   See: AWS_CREDENTIALS_SETUP.md for details"
        echo ""
    fi
fi

echo ""
echo "🚀 Starting development server on http://localhost:8080"
echo "   Press Ctrl+C to stop"
echo ""

# Start the server
cd "$(dirname "$0")"
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
