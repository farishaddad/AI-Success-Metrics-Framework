#!/bin/bash

# Script to add Bedrock permissions to IAM user

USERNAME="farisis"

echo "=========================================="
echo "Adding Bedrock Permissions"
echo "=========================================="
echo ""
echo "User: $USERNAME"
echo ""

# Option 1: Attach AmazonBedrockFullAccess (recommended)
echo "Option 1: Attaching AmazonBedrockFullAccess policy..."
echo "----------------------------------------"

aws iam attach-user-policy \
  --user-name $USERNAME \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess

if [ $? -eq 0 ]; then
    echo "✅ Successfully attached AmazonBedrockFullAccess policy"
else
    echo "❌ Failed to attach policy"
    echo ""
    echo "You may need to:"
    echo "  1. Check you have IAM permissions to modify user policies"
    echo "  2. Add the policy via AWS Console instead"
    echo "  3. Contact your AWS administrator"
fi

echo ""
echo "Verifying permissions..."
echo "----------------------------------------"

aws iam list-attached-user-policies --user-name $USERNAME --output table

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "Test the agent again:"
echo "  agentcore invoke --dev 'Hello! What can you do?'"
echo ""
