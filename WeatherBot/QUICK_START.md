# 🚀 WeatherBot Quick Start

## Prerequisites Checklist

Before running the agent, you need:

- [ ] Python 3.10+ installed
- [ ] AWS CLI installed
- [ ] AWS account with credentials configured
- [ ] Bedrock model access enabled
- [ ] Agent dependencies installed

## Step-by-Step Setup

### 1. Install AWS CLI (if not installed)

**macOS:**
```bash
brew install awscli
```

**Or download from:**
https://aws.amazon.com/cli/

### 2. Configure AWS Credentials

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region: `us-east-1`
- Output format: `json`

**Don't have credentials yet?** See `AWS_CREDENTIALS_SETUP.md`

### 3. Verify AWS Setup

```bash
# Test credentials
aws sts get-caller-identity

# Should show your AWS account info
```

### 4. Enable Bedrock Models

1. Go to: https://console.aws.amazon.com/bedrock
2. Click "Model access" (left sidebar)
3. Click "Manage model access"
4. Enable "Claude 3.5 Sonnet" or "Claude Sonnet 4.5"
5. Click "Save changes"

### 5. Install Agent Dependencies (if not done)

```bash
cd WeatherBot
pip3 install -e .
```

### 6. Run System Check

```bash
python3 test_agent.py
```

This will verify:
- ✅ All dependencies installed
- ✅ AWS credentials configured
- ✅ Bedrock access enabled
- ✅ Agent can be imported

### 7. Start the Agent

**Option A: Using the startup script**
```bash
./run_agent.sh
```

**Option B: Using uvicorn directly**
```bash
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
```

**Option C: Using agentcore CLI**
```bash
agentcore dev
```

The agent will be available at: `http://localhost:8080/invocations`

### 8. Test the Agent

**In a new terminal window:**

```bash
# Test with agentcore CLI
agentcore invoke --dev "Hello! What can you do?"

# Test with curl
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is 5 + 3?"}'

# Test code execution
agentcore invoke --dev "Calculate the factorial of 5"

# Test with session continuity
agentcore invoke --dev --session-id test123 "My name is Alice"
agentcore invoke --dev --session-id test123 "What's my name?"
```

## Common Issues & Solutions

### ❌ "AWS credentials not configured"

**Solution:**
```bash
aws configure
# Enter your access key, secret key, and region
```

### ❌ "Unable to locate credentials"

**Solution:**
Check if credentials file exists:
```bash
cat ~/.aws/credentials
```

If empty, run `aws configure` again.

### ❌ "Access Denied" when calling Bedrock

**Solutions:**
1. Enable model access in Bedrock console
2. Check IAM permissions include `AmazonBedrockFullAccess`
3. Verify you're in a supported region (us-east-1, us-west-2, eu-west-1)

### ❌ "Module not found" errors

**Solution:**
```bash
cd WeatherBot
pip3 install -e .
```

### ❌ "Port 8080 already in use"

**Solution:**
Use a different port:
```bash
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8081 --reload
```

Then test with:
```bash
agentcore invoke --dev --port 8081 "Hello"
```

### ❌ "uv command not found" (when using agentcore dev)

**Solution:**
Install uv:
```bash
brew install uv
# or
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Or use uvicorn directly instead.

## What the Agent Can Do

Your WeatherBot agent includes:

1. **Code Interpreter**: Execute Python code
   ```bash
   agentcore invoke --dev "Calculate fibonacci(10)"
   ```

2. **Math Operations**: Built-in add_numbers tool
   ```bash
   agentcore invoke --dev "What is 25 + 17?"
   ```

3. **Web Search**: Via Exa AI MCP integration
   ```bash
   agentcore invoke --dev "Search for latest AWS news"
   ```

4. **General Conversation**: Powered by Claude
   ```bash
   agentcore invoke --dev "Explain quantum computing"
   ```

## Next Steps

Once the agent is running:

1. **Customize**: Edit `src/main.py` to add your own tools
2. **Add Memory**: Configure conversation persistence
3. **Deploy**: Use `agentcore deploy` to deploy to AWS
4. **Monitor**: Check logs and metrics in CloudWatch

## File Reference

- `src/main.py` - Main agent logic
- `src/model/load.py` - Model configuration
- `src/mcp_client/client.py` - External tool integration
- `.bedrock_agentcore.yaml` - Deployment configuration
- `test_agent.py` - System verification script
- `run_agent.sh` - Startup script

## Getting Help

- **AgentCore Docs**: https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html
- **Strands Framework**: https://github.com/awslabs/strands
- **AWS Credentials**: See `AWS_CREDENTIALS_SETUP.md`
- **Detailed Guide**: See `GETTING_STARTED.md`

## Quick Command Reference

```bash
# Start agent
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload

# Test agent
agentcore invoke --dev "Hello"

# Check AWS credentials
aws sts get-caller-identity

# Install dependencies
pip3 install -e .

# Run system check
python3 test_agent.py

# Deploy to AWS
agentcore deploy

# Check deployment status
agentcore status

# Stop deployment
agentcore destroy
```

---

**Ready to go?** Run `python3 test_agent.py` to verify your setup!
