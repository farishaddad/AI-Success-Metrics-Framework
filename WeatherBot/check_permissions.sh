#!/bin/bash

# Script to check IAM user permissions for Bedrock access

echo "=========================================="
echo "IAM User Permissions Check"
echo "=========================================="
echo ""

# Get current user identity
echo "1. Current AWS Identity:"
echo "----------------------------------------"
aws sts get-caller-identity
echo ""

# Extract username from the error message (farisis)
USERNAME="farisis"

echo "2. Checking permissions for user: $USERNAME"
echo "----------------------------------------"
echo ""

# List attached managed policies
echo "📋 Attached Managed Policies:"
aws iam list-attached-user-policies --user-name $USERNAME --output table
echo ""

# List inline policies
echo "📋 Inline Policies:"
aws iam list-user-policies --user-name $USERNAME --output table
echo ""

# Get user groups
echo "👥 User Groups:"
aws iam list-groups-for-user --user-name $USERNAME --output table
echo ""

# Check for Bedrock-specific permissions
echo "🔍 Checking for Bedrock permissions..."
echo "----------------------------------------"

# Check if AmazonBedrockFullAccess is attached
if aws iam list-attached-user-policies --user-name $USERNAME | grep -q "AmazonBedrockFullAccess"; then
    echo "✅ AmazonBedrockFullAccess policy is attached"
else
    echo "❌ AmazonBedrockFullAccess policy is NOT attached"
fi

# Check groups for Bedrock permissions
echo ""
echo "🔍 Checking group policies..."
GROUPS=$(aws iam list-groups-for-user --user-name $USERNAME --query 'Groups[*].GroupName' --output text)

if [ -n "$GROUPS" ]; then
    for GROUP in $GROUPS; do
        echo ""
        echo "Group: $GROUP"
        echo "  Attached policies:"
        aws iam list-attached-group-policies --group-name $GROUP --output table
    done
else
    echo "  No groups found"
fi

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "Required permissions for Bedrock:"
echo "  • bedrock:InvokeModel"
echo "  • bedrock:InvokeModelWithResponseStream"
echo ""
echo "To fix the AccessDeniedException, run:"
echo ""
echo "  aws iam attach-user-policy \\"
echo "    --user-name $USERNAME \\"
echo "    --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess"
echo ""
echo "Or add via AWS Console:"
echo "  1. Go to: https://console.aws.amazon.com/iam"
echo "  2. Click Users → $USERNAME"
echo "  3. Click 'Add permissions'"
echo "  4. Attach 'AmazonBedrockFullAccess' policy"
echo ""
