#!/bin/bash

# Run WeatherBot agent with specific AWS profile

PROFILE_NAME="account-444"

echo "🤖 Starting WeatherBot with AWS profile: $PROFILE_NAME"
echo ""

# Verify profile exists and works
echo "Verifying AWS credentials..."
if aws sts get-caller-identity --profile $PROFILE_NAME &> /dev/null; then
    ACCOUNT=$(aws sts get-caller-identity --profile $PROFILE_NAME --query 'Account' --output text)
    echo "✅ Connected to AWS Account: $ACCOUNT"
else
    echo "❌ Profile '$PROFILE_NAME' not configured or invalid"
    echo ""
    echo "Configure it with:"
    echo "  aws configure --profile $PROFILE_NAME"
    exit 1
fi

echo ""
echo "Starting agent server..."
echo "Server will be available at: http://localhost:8080"
echo ""

# Set profile and start server
export AWS_PROFILE=$PROFILE_NAME

cd "$(dirname "$0")"
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
