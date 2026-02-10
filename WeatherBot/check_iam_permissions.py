#!/usr/bin/env python3
"""
Check IAM permissions for the current user
"""

import boto3
import json
from botocore.exceptions import ClientError

def get_current_user():
    """Get current IAM user identity"""
    try:
        sts = boto3.client('sts')
        identity = sts.get_caller_identity()
        
        # Extract username from ARN
        arn = identity['Arn']
        if ':user/' in arn:
            username = arn.split(':user/')[-1]
        else:
            username = None
            
        return {
            'account': identity['Account'],
            'arn': arn,
            'username': username,
            'user_id': identity['UserId']
        }
    except Exception as e:
        print(f"❌ Error getting identity: {e}")
        return None

def check_attached_policies(username):
    """Check managed policies attached to user"""
    try:
        iam = boto3.client('iam')
        response = iam.list_attached_user_policies(UserName=username)
        return response.get('AttachedPolicies', [])
    except ClientError as e:
        print(f"❌ Error checking attached policies: {e}")
        return []

def check_inline_policies(username):
    """Check inline policies for user"""
    try:
        iam = boto3.client('iam')
        response = iam.list_user_policies(UserName=username)
        return response.get('PolicyNames', [])
    except ClientError as e:
        print(f"❌ Error checking inline policies: {e}")
        return []

def check_user_groups(username):
    """Check groups user belongs to"""
    try:
        iam = boto3.client('iam')
        response = iam.list_groups_for_user(UserName=username)
        return response.get('Groups', [])
    except ClientError as e:
        print(f"❌ Error checking groups: {e}")
        return []

def check_group_policies(group_name):
    """Check policies attached to a group"""
    try:
        iam = boto3.client('iam')
        response = iam.list_attached_group_policies(GroupName=group_name)
        return response.get('AttachedPolicies', [])
    except ClientError as e:
        print(f"❌ Error checking group policies: {e}")
        return []

def has_bedrock_permissions(policies):
    """Check if any policy grants Bedrock access"""
    bedrock_policies = [
        'AmazonBedrockFullAccess',
        'BedrockInvokeAccess'
    ]
    
    for policy in policies:
        if policy['PolicyName'] in bedrock_policies:
            return True
        if 'Bedrock' in policy['PolicyName']:
            return True
    
    return False

def main():
    print("=" * 70)
    print("🔍 IAM Permissions Check for Bedrock Access")
    print("=" * 70)
    print()
    
    # Get current user
    print("1️⃣  Current AWS Identity")
    print("-" * 70)
    identity = get_current_user()
    
    if not identity:
        print("❌ Could not determine current user")
        return 1
    
    print(f"   Account: {identity['account']}")
    print(f"   ARN: {identity['arn']}")
    print(f"   User ID: {identity['user_id']}")
    
    if not identity['username']:
        print()
        print("⚠️  Not an IAM user (might be a role or root account)")
        print("   Bedrock permissions depend on the role/account policies")
        return 0
    
    username = identity['username']
    print(f"   Username: {username}")
    print()
    
    # Check attached policies
    print("2️⃣  Attached Managed Policies")
    print("-" * 70)
    attached_policies = check_attached_policies(username)
    
    if attached_policies:
        for policy in attached_policies:
            print(f"   ✓ {policy['PolicyName']}")
            print(f"     ARN: {policy['PolicyArn']}")
    else:
        print("   (none)")
    print()
    
    # Check inline policies
    print("3️⃣  Inline Policies")
    print("-" * 70)
    inline_policies = check_inline_policies(username)
    
    if inline_policies:
        for policy_name in inline_policies:
            print(f"   ✓ {policy_name}")
    else:
        print("   (none)")
    print()
    
    # Check groups
    print("4️⃣  User Groups")
    print("-" * 70)
    groups = check_user_groups(username)
    
    all_group_policies = []
    if groups:
        for group in groups:
            group_name = group['GroupName']
            print(f"   📁 {group_name}")
            
            group_policies = check_group_policies(group_name)
            if group_policies:
                for policy in group_policies:
                    print(f"      ✓ {policy['PolicyName']}")
                    all_group_policies.append(policy)
            else:
                print("      (no policies)")
    else:
        print("   (none)")
    print()
    
    # Check for Bedrock permissions
    print("5️⃣  Bedrock Access Check")
    print("-" * 70)
    
    has_bedrock = (
        has_bedrock_permissions(attached_policies) or
        has_bedrock_permissions(all_group_policies)
    )
    
    if has_bedrock:
        print("   ✅ User has Bedrock-related policies attached")
    else:
        print("   ❌ No Bedrock-specific policies found")
    
    print()
    print("   Required permissions:")
    print("      • bedrock:InvokeModel")
    print("      • bedrock:InvokeModelWithResponseStream")
    print()
    
    # Summary and recommendations
    print("=" * 70)
    print("📋 Summary & Recommendations")
    print("=" * 70)
    print()
    
    if has_bedrock:
        print("✅ User appears to have Bedrock access")
        print()
        print("If you're still getting AccessDeniedException:")
        print("   1. Check if model access is enabled in Bedrock console")
        print("   2. Verify you're in the correct AWS region (us-east-1)")
        print("   3. Wait a few minutes for policy changes to propagate")
    else:
        print("❌ User does NOT have Bedrock access")
        print()
        print("To fix this, run:")
        print()
        print(f"   aws iam attach-user-policy \\")
        print(f"     --user-name {username} \\")
        print(f"     --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess")
        print()
        print("Or use the AWS Console:")
        print("   1. Go to: https://console.aws.amazon.com/iam")
        print(f"   2. Click Users → {username}")
        print("   3. Click 'Add permissions' → 'Attach policies directly'")
        print("   4. Search for and select 'AmazonBedrockFullAccess'")
        print("   5. Click 'Add permissions'")
        print()
        print("Or run the fix script:")
        print("   ./fix_permissions.sh")
    
    print()
    return 0 if has_bedrock else 1

if __name__ == "__main__":
    try:
        exit(main())
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        exit(1)
