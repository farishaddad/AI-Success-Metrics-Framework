#!/bin/bash

# Interactive script to configure new AWS account for WeatherBot

NEW_ACCOUNT_ID="444165144454"
PROFILE_NAME="account-444"

clear
echo "=========================================="
echo "🔧 AWS Account Setup for WeatherBot"
echo "=========================================="
echo ""
echo "Target Account ID: $NEW_ACCOUNT_ID"
echo "Profile Name: $PROFILE_NAME"
echo ""
echo "This script will:"
echo "  1. Configure AWS credentials for the new account"
echo "  2. Verify the connection"
echo "  3. Check Bedrock access"
echo "  4. Set up the environment for WeatherBot"
echo ""
read -p "Press Enter to continue..."
echo ""

# Step 1: Configure credentials
echo "=========================================="
echo "Step 1: Configure AWS Credentials"
echo "=========================================="
echo ""
echo "You'll need:"
echo "  • AWS Access Key ID (starts with AKIA...)"
echo "  • AWS Secret Access Key (40 characters)"
echo ""
echo "If you don't have these yet:"
echo "  1. Sign in to AWS Console for account $NEW_ACCOUNT_ID"
echo "  2. Go to IAM → Users"
echo "  3. Select your user (or create one)"
echo "  4. Go to 'Security credentials' tab"
echo "  5. Click 'Create access key'"
echo "  6. Choose 'Command Line Interface (CLI)'"
echo "  7. Download the credentials"
echo ""
read -p "Do you have your credentials ready? (y/n): " READY

if [[ $READY != "y" && $READY != "Y" ]]; then
    echo ""
    echo "Please get your credentials first, then run this script again."
    exit 0
fi

echo ""
echo "Configuring profile: $PROFILE_NAME"
echo ""

# Run aws configure for the new profile
aws configure --profile $PROFILE_NAME

# Step 2: Verify connection
echo ""
echo "=========================================="
echo "Step 2: Verifying Connection"
echo "=========================================="
echo ""

if aws sts get-caller-identity --profile $PROFILE_NAME &> /dev/null; then
    ACCOUNT=$(aws sts get-caller-identity --profile $PROFILE_NAME --query 'Account' --output text)
    USER_ARN=$(aws sts get-caller-identity --profile $PROFILE_NAME --query 'Arn' --output text)
    
    echo "✅ Successfully connected!"
    echo ""
    echo "Account ID: $ACCOUNT"
    echo "User ARN: $USER_ARN"
    echo ""
    
    if [[ "$ACCOUNT" != "$NEW_ACCOUNT_ID" ]]; then
        echo "⚠️  WARNING: Connected account ($ACCOUNT) doesn't match expected ($NEW_ACCOUNT_ID)"
        echo "   Please verify you're using the correct credentials."
        echo ""
    fi
else
    echo "❌ Failed to connect to AWS"
    echo ""
    echo "Please check:"
    echo "  • Access Key ID is correct"
    echo "  • Secret Access Key is correct"
    echo "  • You have network connectivity"
    echo ""
    exit 1
fi

# Step 3: Check Bedrock access
echo "=========================================="
echo "Step 3: Checking Bedrock Access"
echo "=========================================="
echo ""

REGION=$(aws configure get region --profile $PROFILE_NAME)
if [ -z "$REGION" ]; then
    REGION="us-east-1"
fi

echo "Checking Bedrock in region: $REGION"
echo ""

# Try to list Bedrock models
if aws bedrock list-foundation-models --region $REGION --profile $PROFILE_NAME &> /dev/null; then
    echo "✅ Bedrock API is accessible"
    
    # Check for Claude models
    CLAUDE_COUNT=$(aws bedrock list-foundation-models --region $REGION --profile $PROFILE_NAME --query 'modelSummaries[?contains(modelId, `claude`)] | length(@)' --output text)
    
    if [ "$CLAUDE_COUNT" -gt 0 ]; then
        echo "✅ Found $CLAUDE_COUNT Claude models available"
    else
        echo "⚠️  No Claude models found"
        echo "   You may need to enable model access in Bedrock console"
    fi
else
    echo "❌ Cannot access Bedrock API"
    echo ""
    echo "Possible issues:"
    echo "  • User doesn't have Bedrock permissions"
    echo "  • Bedrock not available in region $REGION"
    echo "  • Model access not enabled"
    echo ""
    echo "To fix:"
    echo "  1. Go to: https://console.aws.amazon.com/iam"
    echo "  2. Add 'AmazonBedrockFullAccess' policy to your user"
    echo "  3. Go to: https://console.aws.amazon.com/bedrock"
    echo "  4. Enable Claude model access"
fi

echo ""

# Step 4: Set up environment
echo "=========================================="
echo "Step 4: Environment Setup"
echo "=========================================="
echo ""

# Create .env file for the profile
cat > .env.account-444 << EOF
# AWS Configuration for Account $NEW_ACCOUNT_ID
AWS_PROFILE=$PROFILE_NAME
AWS_DEFAULT_REGION=$REGION
AWS_REGION=$REGION

# Uncomment if you want to use explicit credentials instead of profile
# AWS_ACCESS_KEY_ID=your_access_key_here
# AWS_SECRET_ACCESS_KEY=your_secret_key_here
EOF

echo "✅ Created .env.account-444 file"
echo ""

# Create a startup script
cat > start_with_new_account.sh << 'EOF'
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
EOF

chmod +x start_with_new_account.sh

echo "✅ Created start_with_new_account.sh script"
echo ""

# Summary
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Your new AWS account is configured and ready to use."
echo ""
echo "To start WeatherBot with the new account:"
echo ""
echo "  Option 1: Use the startup script"
echo "    ./start_with_new_account.sh"
echo ""
echo "  Option 2: Set profile manually"
echo "    export AWS_PROFILE=$PROFILE_NAME"
echo "    python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload"
echo ""
echo "  Option 3: Use agentcore CLI"
echo "    AWS_PROFILE=$PROFILE_NAME agentcore dev"
echo ""
echo "To test the agent:"
echo "    AWS_PROFILE=$PROFILE_NAME agentcore invoke --dev 'Hello!'"
echo ""
echo "To switch back to the old account:"
echo "    unset AWS_PROFILE"
echo "    # or"
echo "    export AWS_PROFILE=default"
echo ""
echo "Configuration files created:"
echo "  • ~/.aws/credentials (profile: $PROFILE_NAME)"
echo "  • ~/.aws/config (profile: $PROFILE_NAME)"
echo "  • .env.account-444"
echo "  • start_with_new_account.sh"
echo ""
