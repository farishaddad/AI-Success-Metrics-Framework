# AWS Credentials Setup Guide

## Quick Setup (5 minutes)

### Step 1: Sign in to AWS Console
1. Go to [https://console.aws.amazon.com](https://console.aws.amazon.com)
2. Sign in with your root account email and password

### Step 2: Create an IAM User

1. **Navigate to IAM**:
   - In the AWS Console search bar, type "IAM" and click on "IAM"
   - Or go directly to: [https://console.aws.amazon.com/iam](https://console.aws.amazon.com/iam)

2. **Create a New User**:
   - Click "Users" in the left sidebar
   - Click "Create user" button
   - Enter a username (e.g., `agentcore-dev`)
   - Click "Next"

3. **Set Permissions**:
   - Select "Attach policies directly"
   - Search for and select these policies:
     - ✅ `AmazonBedrockFullAccess` (for using Bedrock models)
     - ✅ `IAMFullAccess` (for AgentCore to create roles)
     - ✅ `AmazonS3FullAccess` (for storing agent code)
     - ✅ `CloudWatchLogsFullAccess` (for logging)
   - Click "Next"

4. **Review and Create**:
   - Review the settings
   - Click "Create user"

### Step 3: Create Access Keys

1. **Navigate to the User**:
   - Click on the username you just created
   - Go to the "Security credentials" tab

2. **Create Access Key**:
   - Scroll down to "Access keys" section
   - Click "Create access key"
   - Select "Command Line Interface (CLI)"
   - Check the confirmation box
   - Click "Next"
   - (Optional) Add a description tag
   - Click "Create access key"

3. **Save Your Credentials** ⚠️ IMPORTANT:
   - You'll see:
     - **Access key ID**: `AKIA...` (20 characters)
     - **Secret access key**: `wJalr...` (40 characters)
   - **Download the .csv file** or copy both values
   - ⚠️ You won't be able to see the secret key again!

### Step 4: Configure AWS CLI

Open your terminal and run:

```bash
aws configure
```

You'll be prompted for:

```
AWS Access Key ID [None]: AKIA................
AWS Secret Access Key [None]: wJalr...............................
Default region name [None]: us-east-1
Default output format [None]: json
```

**Recommended Regions for Bedrock:**
- `us-east-1` (US East - N. Virginia) - Most models available
- `us-west-2` (US West - Oregon)
- `eu-west-1` (Europe - Ireland)

### Step 5: Verify Configuration

Test your credentials:

```bash
# Check if credentials are configured
aws sts get-caller-identity

# Should return something like:
# {
#     "UserId": "AIDA...",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/agentcore-dev"
# }
```

### Step 6: Enable Bedrock Model Access

1. **Navigate to Bedrock**:
   - Go to [https://console.aws.amazon.com/bedrock](https://console.aws.amazon.com/bedrock)
   - Make sure you're in the correct region (check top-right corner)

2. **Request Model Access**:
   - Click "Model access" in the left sidebar
   - Click "Manage model access" or "Enable specific models"
   - Find "Anthropic" section
   - Check the box for "Claude 3.5 Sonnet v2" or "Claude Sonnet 4.5"
   - Click "Request model access" or "Save changes"
   - Wait a few seconds - most models are instantly available

3. **Verify Access**:
   - The status should change to "Access granted" (green checkmark)

## Alternative: Using Environment Variables

Instead of `aws configure`, you can set environment variables:

```bash
# Add to your ~/.zshrc or ~/.bash_profile
export AWS_ACCESS_KEY_ID="AKIA................"
export AWS_SECRET_ACCESS_KEY="wJalr..............................."
export AWS_DEFAULT_REGION="us-east-1"
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

## Alternative: Using AWS SSO (Recommended for Organizations)

If your organization uses AWS SSO:

```bash
aws configure sso
```

Follow the prompts to authenticate via your browser.

## Security Best Practices

### ✅ DO:
- Use IAM users (not root account) for daily work
- Enable MFA (Multi-Factor Authentication) on your root account
- Rotate access keys regularly (every 90 days)
- Use least-privilege permissions (only what you need)
- Store credentials securely (never commit to git)

### ❌ DON'T:
- Share your access keys
- Commit credentials to version control
- Use root account credentials for CLI
- Give overly broad permissions

## Troubleshooting

### "Unable to locate credentials"
```bash
# Check if credentials file exists
cat ~/.aws/credentials

# Should show:
# [default]
# aws_access_key_id = AKIA...
# aws_secret_access_key = wJalr...
```

### "Access Denied" errors
- Verify your IAM user has the necessary permissions
- Check you're in the correct AWS region
- Ensure Bedrock model access is enabled

### "Region not supported"
- Bedrock is not available in all regions
- Switch to `us-east-1`, `us-west-2`, or `eu-west-1`

### Model access pending
- Some models require approval (usually instant)
- Check the Bedrock console for status
- Try a different model if one is pending

## Cost Considerations

### Free Tier
- AWS Free Tier includes some free usage
- Bedrock charges per token (input/output)
- AgentCore runtime has separate charges

### Estimated Costs for Development
- **Bedrock Claude**: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- **AgentCore Runtime**: Pay per invocation and duration
- **S3 Storage**: Minimal (cents per month)

**Tip**: Set up billing alerts in AWS Console to avoid surprises!

## Quick Reference

```bash
# Configure credentials
aws configure

# Verify credentials
aws sts get-caller-identity

# List available Bedrock models
aws bedrock list-foundation-models --region us-east-1

# Test Bedrock access
aws bedrock-runtime invoke-model \
  --model-id anthropic.claude-3-sonnet-20240229-v1:0 \
  --body '{"anthropic_version":"bedrock-2023-05-31","messages":[{"role":"user","content":"Hello"}],"max_tokens":100}' \
  --region us-east-1 \
  output.json

# View credentials file location
echo ~/.aws/credentials

# View config file location
echo ~/.aws/config
```

## Next Steps

Once credentials are configured:

1. ✅ Test with: `aws sts get-caller-identity`
2. ✅ Enable Bedrock model access in console
3. ✅ Start your WeatherBot agent: `cd WeatherBot && python3 -m uvicorn src.main:app --reload`
4. ✅ Test the agent: `agentcore invoke --dev "Hello!"`

## Additional Resources

- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [Bedrock Model Access](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html)
- [AgentCore Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html)
