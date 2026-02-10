#!/bin/bash

# Script to configure a new AWS account profile

NEW_ACCOUNT_ID="444165144454"
PROFILE_NAME="account-444"

echo "=========================================="
echo "AWS Account Configuration"
echo "=========================================="
echo ""
echo "Setting up profile for account: $NEW_ACCOUNT_ID"
echo "Profile name: $PROFILE_NAME"
echo ""

# Configure new profile
echo "Running: aws configure --profile $PROFILE_NAME"
echo ""
echo "You'll need:"
echo "  • AWS Access Key ID for account $NEW_ACCOUNT_ID"
echo "  • AWS Secret Access Key"
echo "  • Default region (e.g., us-east-1)"
echo "  • Output format (json)"
echo ""

aws configure --profile $PROFILE_NAME

echo ""
echo "=========================================="
echo "Verifying Configuration"
echo "=========================================="
echo ""

# Test the new profile
aws sts get-caller-identity --profile $PROFILE_NAME

echo ""
echo "=========================================="
echo "Usage"
echo "=========================================="
echo ""
echo "To use this account, you have two options:"
echo ""
echo "Option 1: Set as default for current session"
echo "  export AWS_PROFILE=$PROFILE_NAME"
echo ""
echo "Option 2: Specify profile in each command"
echo "  aws s3 ls --profile $PROFILE_NAME"
echo ""
echo "For the WeatherBot agent, set the environment variable:"
echo "  export AWS_PROFILE=$PROFILE_NAME"
echo "  python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload"
echo ""
