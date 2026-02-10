# WeatherBot Agent - Getting Started

## ✅ What We've Done

1. **Installed AWS Bedrock AgentCore Toolkit**
   - Version: 0.2.8
   - All dependencies installed successfully

2. **Created Sample Agent Project: WeatherBot**
   - Template: Basic (runtime-only)
   - Agent Framework: Strands
   - Model Provider: AWS Bedrock (Claude Sonnet 4.5)
   - Location: `WeatherBot/` directory

## 📁 Project Structure

```
WeatherBot/
├── src/
│   ├── main.py              # Main agent entrypoint
│   ├── model/
│   │   └── load.py          # Bedrock model configuration
│   └── mcp_client/
│       └── client.py        # MCP client for external tools
├── test/                    # Test directory (empty)
├── .bedrock_agentcore.yaml  # AgentCore configuration
├── pyproject.toml           # Python dependencies
└── README.md                # Project documentation
```

## 🎯 What the Agent Does

The WeatherBot agent includes:
- **Code Interpreter**: Can execute Python code
- **Custom Tool**: `add_numbers()` function
- **MCP Tools**: Access to Exa AI search capabilities
- **Streaming Responses**: Real-time response streaming

## 🚀 How to Use It

### 1. Start the Development Server

```bash
cd WeatherBot
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
```

The server will be available at `http://localhost:8080/invocations`

### 2. Test the Agent Locally

**Option A: Using agentcore CLI**
```bash
agentcore invoke --dev "Hello! What can you do?"
```

**Option B: Using curl**
```bash
curl -X POST http://localhost:8080/invocations \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is 5 + 3?"}'
```

**Option C: Using Python**
```python
import requests

response = requests.post(
    "http://localhost:8080/invocations",
    json={"prompt": "Hello! What can you do?"}
)
print(response.text)
```

## ⚠️ Important Notes

### AWS Credentials Required

The agent uses AWS Bedrock's Claude model, which requires:
- AWS account with Bedrock access
- AWS credentials configured (via `aws configure` or environment variables)
- Model access enabled in AWS Bedrock console

To configure AWS credentials:
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
```

### Alternative: Use a Different Model

If you don't have AWS Bedrock access, you can modify `src/model/load.py` to use a different model provider (OpenAI, Anthropic, etc.).

## 🧪 Example Interactions

Once the server is running and AWS credentials are configured:

```bash
# Test the add_numbers tool
agentcore invoke --dev "What is 25 + 17?"

# Test code execution
agentcore invoke --dev "Calculate the factorial of 5 using Python"

# Test general conversation
agentcore invoke --dev "Explain what you can do"

# Test with session continuity
agentcore invoke --dev --session-id abc123 "Remember my name is John"
agentcore invoke --dev --session-id abc123 "What's my name?"
```

## 🚀 Deploy to AWS

When ready to deploy to production:

```bash
# Configure deployment settings
agentcore configure --entrypoint src/main.py

# Deploy to AWS
agentcore deploy

# Check deployment status
agentcore status

# Invoke the deployed agent
agentcore invoke "Hello from the cloud!"

# Stop the session when done
agentcore stop-session

# Clean up resources
agentcore destroy --dry-run  # Preview first
agentcore destroy            # Actually destroy
```

## 📚 Next Steps

1. **Customize the Agent**: Edit `src/main.py` to add your own tools and logic
2. **Add Memory**: Use `agentcore configure` to add conversation memory
3. **Add Gateway**: Integrate external APIs as tools via AgentCore Gateway
4. **Write Tests**: Add pytest tests in the `test/` directory
5. **Deploy**: Use `agentcore deploy` to deploy to AWS

## 🔧 Troubleshooting

**Server won't start:**
- Check that port 8080 is available
- Verify all dependencies are installed: `pip3 install -e .`

**AWS authentication errors:**
- Run `aws configure` to set up credentials
- Verify Bedrock model access in AWS console
- Check your AWS region supports Bedrock

**Import errors:**
- Make sure you're in the WeatherBot directory
- Reinstall dependencies: `pip3 install -e .`

## 📖 Learn More

- [AgentCore Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/agentcore.html)
- [Strands Agents Framework](https://github.com/awslabs/strands)
- [MCP Protocol](https://modelcontextprotocol.io/)
