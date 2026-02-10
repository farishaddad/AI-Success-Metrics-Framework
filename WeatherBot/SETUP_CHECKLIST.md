# ✅ New AWS Account Setup Checklist

Account ID: **444165144454**

## Before You Start

- [ ] I have AWS Access Key ID for account 444165144454
- [ ] I have AWS Secret Access Key for account 444165144454
- [ ] I'm signed in to AWS Console for this account

---

## Setup Steps

### 1. Configure AWS Credentials
```bash
cd WeatherBot
./setup_new_account.sh
```
- [ ] Script completed successfully
- [ ] Verified connection to account 444165144454

### 2. Enable Bedrock Model Access
Go to: https://console.aws.amazon.com/bedrock
- [ ] Selected region: us-east-1
- [ ] Clicked "Model access"
- [ ] Enabled Claude 3.5 Sonnet or Claude Sonnet 4.5
- [ ] Status shows "Access granted"

### 3. Add IAM Permissions
Go to: https://console.aws.amazon.com/iam
- [ ] Found my IAM user
- [ ] Added "AmazonBedrockFullAccess" policy
- [ ] Permissions saved successfully

### 4. Test Connection
```bash
aws sts get-caller-identity --profile account-444
```
- [ ] Shows Account: "444165144454"
- [ ] No errors

### 5. Start the Agent
```bash
./start_with_new_account.sh
```
- [ ] Server started on http://localhost:8080
- [ ] No errors in console

### 6. Test the Agent
In a new terminal:
```bash
AWS_PROFILE=account-444 agentcore invoke --dev "Hello!"
```
- [ ] Got response from Claude
- [ ] No AccessDeniedException errors

---

## ✅ All Done!

If all boxes are checked, your new AWS account is ready to use!

## Quick Commands

**Start agent:**
```bash
./start_with_new_account.sh
```

**Test agent:**
```bash
AWS_PROFILE=account-444 agentcore invoke --dev "What can you do?"
```

**Check account:**
```bash
aws sts get-caller-identity --profile account-444
```

---

## ❌ Troubleshooting

If something didn't work, see:
- `NEW_ACCOUNT_SETUP_GUIDE.md` - Detailed setup instructions
- `AWS_CREDENTIALS_SETUP.md` - AWS credentials help
- `QUICK_START.md` - General troubleshooting

Or run the setup script again:
```bash
./setup_new_account.sh
```
