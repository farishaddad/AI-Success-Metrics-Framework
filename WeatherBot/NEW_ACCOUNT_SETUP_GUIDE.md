# Setting Up New AWS Account (444165144454)

## Quick Setup (5 minutes)

### Step 1: Get Your Credentials

Before starting, you need:
- ✅ AWS Access Key ID (starts with `AKIA...`)
- ✅ AWS Secret Access Key (40 character string)

**Don't have them yet?**

1. Sign in to AWS Console: https://console.aws.amazon.com
2. Make sure you're in account **444165144454**
3. Go to **IAM** → **Users**
4. Click on your username (or create a new user)
5. Go to **Security credentials** tab
6. Click **Create access key**
7. Select **Command Line Interface (CLI)**
8. Click **Next** → **Create access key**
9. **Download the .csv file** or copy both values

### Step 2: Run the Setup Script

Open your terminal in the WeatherBot directory and run:

```bash
cd WeatherBot
./setup_new_account.sh
```

The script will:
- ✅ Configure AWS credentials for the new account
- ✅ Verify the connection
- ✅ Check Bedrock access
- ✅ Create startup scripts

**Follow the prompts** and enter your credentials when asked.

### Step 3: Enable Bedrock Access (Important!)

1. Go to: https://console.aws.amazon.com/bedrock
2. Make sure you're in account **444165144454**
3. Select region **us-east-1** (top-right corner)
4. Click **Model access** (left sidebar)
5. Click **Manage model access**
6. Find **Anthropic** section
7. Check ✅ **Claude 3.5 Sonnet** or **Claude Sonnet 4.5**
8. Click **Request model access**
9. Wait for status to show **Access granted** (usually instant)

### Step 4: Add Bedrock Permissions to Your User

1. Go to: https://console.aws.amazon.com/iam
2. Click **Users** → Select your username
3. Click **Add permissions**
4. Select **Attach policies directly**
5. Search for: `AmazonBedrockFullAccess`
6. Check the box ✅
7. Click **Add permissions**

### Step 5: Start the Agent

```bash
cd WeatherBot
./start_with_new_account.sh
```

The agent will start on `http://localhost:8080`

### Step 6: Test It!

In a new terminal:

```bash
cd WeatherBot
AWS_PROFILE=account-444 agentcore invoke --dev "Hello! What can you do?"
```

You should get a response from Claude! 🎉

---

## Manual Setup (Alternative)

If you prefer to configure manually:

### Configure the Profile

```bash
aws configure --profile account-444
```

Enter when prompted:
- **AWS Access Key ID**: `AKIA...`
- **AWS Secret Access Key**: `...`
- **Default region**: `us-east-1`
- **Output format**: `json`

### Verify It Works

```bash
aws sts get-caller-identity --profile account-444
```

Should show:
```json
{
    "Account": "444165144454",
    "UserId": "AIDA...",
    "Arn": "arn:aws:iam::444165144454:user/your-username"
}
```

### Start the Agent

```bash
export AWS_PROFILE=account-444
cd WeatherBot
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
```

### Test It

```bash
AWS_PROFILE=account-444 agentcore invoke --dev "Hello!"
```

---

## Switching Between Accounts

### Use New Account (444165144454)

```bash
export AWS_PROFILE=account-444
# or
./start_with_new_account.sh
```

### Use Old Account (078801794900)

```bash
export AWS_PROFILE=default
# or
unset AWS_PROFILE
```

### Check Current Account

```bash
aws sts get-caller-identity
```

---

## Troubleshooting

### ❌ "Unable to locate credentials"

**Solution:**
```bash
aws configure --profile account-444
# Re-enter your credentials
```

### ❌ "AccessDeniedException" when calling Bedrock

**Solutions:**
1. ✅ Enable model access in Bedrock console (Step 3 above)
2. ✅ Add `AmazonBedrockFullAccess` policy to your IAM user (Step 4 above)
3. ✅ Verify you're in region `us-east-1`
4. ✅ Wait a few minutes for changes to propagate

### ❌ "Profile account-444 not found"

**Solution:**
```bash
# Check if profile exists
cat ~/.aws/credentials | grep account-444

# If not found, configure it
aws configure --profile account-444
```

### ❌ Wrong account ID showing

**Solution:**
```bash
# Check which account you're using
aws sts get-caller-identity --profile account-444

# Should show Account: "444165144454"
# If not, reconfigure with correct credentials
```

---

## Files Created

After setup, you'll have:

- `~/.aws/credentials` - Contains your access keys (profile: account-444)
- `~/.aws/config` - Contains region and output settings
- `.env.account-444` - Environment variables for the new account
- `start_with_new_account.sh` - Quick startup script

---

## Security Notes

⚠️ **Important:**
- Never commit credentials to git
- Don't share your access keys
- Rotate keys regularly (every 90 days)
- Use MFA on your AWS account
- Only grant necessary permissions

---

## Quick Reference

```bash
# Configure new account
./setup_new_account.sh

# Start agent with new account
./start_with_new_account.sh

# Test agent
AWS_PROFILE=account-444 agentcore invoke --dev "Hello"

# Check current account
aws sts get-caller-identity

# Switch accounts
export AWS_PROFILE=account-444    # New account
export AWS_PROFILE=default        # Old account
unset AWS_PROFILE                 # Use default

# View credentials
cat ~/.aws/credentials

# View config
cat ~/.aws/config
```

---

## Need Help?

If you run into issues:

1. ✅ Run the setup script: `./setup_new_account.sh`
2. ✅ Check credentials: `aws sts get-caller-identity --profile account-444`
3. ✅ Verify Bedrock access in AWS Console
4. ✅ Ensure IAM permissions are correct
5. ✅ Check you're in the right region (us-east-1)

**Ready to start?** Run `./setup_new_account.sh` now!
