#!/bin/bash

echo "=================================================="
echo "AWS Account Connection Verification"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check AWS CLI
echo "1. Checking AWS CLI..."
if command -v aws &> /dev/null; then
    echo -e "${GREEN}✓${NC} AWS CLI is installed"
    aws --version
else
    echo -e "${RED}✗${NC} AWS CLI is not installed"
    exit 1
fi
echo ""

# Check credentials
echo "2. Checking AWS credentials for profile 'account-444'..."
if aws sts get-caller-identity --profile account-444 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Credentials are valid"
    aws sts get-caller-identity --profile account-444
else
    echo -e "${RED}✗${NC} Credentials are invalid or profile not found"
    exit 1
fi
echo ""

# Check Bedrock access
echo "3. Checking Bedrock access..."
if aws bedrock list-foundation-models --region us-east-1 --profile account-444 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Bedrock access confirmed"
    echo ""
    echo "Available Claude models:"
    aws bedrock list-foundation-models \
        --region us-east-1 \
        --profile account-444 \
        --query 'modelSummaries[?contains(modelId, `claude-sonnet-4`)].{ModelId:modelId,Name:modelName}' \
        --output table
else
    echo -e "${RED}✗${NC} No Bedrock access"
    exit 1
fi
echo ""

# Check WeatherBot configuration
echo "4. Checking WeatherBot configuration..."
if [ -f "WeatherBot/.env" ]; then
    echo -e "${GREEN}✓${NC} WeatherBot .env file exists"
    echo ""
    echo "Configuration:"
    grep -E "(AWS_REGION|AWS_PROFILE|MODEL_ID)" WeatherBot/.env
else
    echo -e "${RED}✗${NC} WeatherBot .env file not found"
    exit 1
fi
echo ""

# Check if services are running
echo "5. Checking running services..."
echo ""

# Check backend
if lsof -i :3001 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Backend API is running on port 3001"
else
    echo -e "${YELLOW}⚠${NC} Backend API is not running on port 3001"
fi

# Check frontend
if lsof -i :3000 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Frontend is running on port 3000"
else
    echo -e "${YELLOW}⚠${NC} Frontend is not running on port 3000"
fi

# Check agent
if lsof -i :8081 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Agent is running on port 8081"
else
    echo -e "${YELLOW}⚠${NC} Agent is not running on port 8081"
fi

echo ""
echo "=================================================="
echo "Verification Complete!"
echo "=================================================="
echo ""
echo "Your AWS Account Details:"
echo "  Account ID: 844416514454"
echo "  Profile: account-444"
echo "  Region: us-east-1"
echo "  User: agentcore-dev"
echo ""
echo "Next Steps:"
echo "  1. Start services: ./START_DASHBOARD.sh"
echo "  2. Open dashboard: http://localhost:3000"
echo "  3. Go to '🤖 Agent Demo' tab"
echo "  4. Start chatting!"
echo ""
