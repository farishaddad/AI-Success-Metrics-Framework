import os
import time
from strands import Agent, tool
from strands_tools.code_interpreter import AgentCoreCodeInterpreter
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from mcp_client.client import get_streamable_http_mcp_client
from model.load import load_model
from middleware.metrics import metrics_collector

app = BedrockAgentCoreApp()
log = app.logger

# Add CORS headers to the app
@app.middleware("http")
async def add_cors_headers(request, call_next):
    # Handle OPTIONS preflight requests
    if request.method == "OPTIONS":
        from starlette.responses import Response
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        )
    
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

REGION = os.getenv("AWS_REGION")

# Import AgentCore Gateway as Streamable HTTP MCP Client
mcp_client = get_streamable_http_mcp_client()

# Define a simple function tool
@tool
def add_numbers(a: int, b: int) -> int:
    """Return the sum of two numbers"""
    return a+b

@app.entrypoint
async def invoke(payload, context):
    session_id = getattr(context, 'session_id', 'default')
    prompt = payload.get("prompt", "")
    
    # Start metrics collection
    invocation_data = metrics_collector.start_invocation(session_id, prompt)
    invocation_id = invocation_data['invocation_id']
    
    response_text = ""
    success = True
    
    try:
        # Create code interpreter
        code_interpreter = AgentCoreCodeInterpreter(
            region=REGION,
            session_name=session_id,
            auto_create=True,
            persist_sessions=True
        )

        with mcp_client as client:
            # Get MCP Tools
            tools = client.list_tools_sync()

            # Create agent
            agent = Agent(
                model=load_model(),
                system_prompt="""
                    You are a helpful assistant with code execution capabilities. Use tools when appropriate.
                """,
                tools=[code_interpreter.code_interpreter, add_numbers] + tools
            )

            # Execute and format response
            stream = agent.stream_async(prompt)
            
            tool_start_time = None

            async for event in stream:
                # Handle Text parts of the response
                if "data" in event and isinstance(event["data"], str):
                    response_text += event["data"]
                    yield event["data"]
                
                # Track tool usage
                if "toolUse" in event:
                    tool_start_time = time.time()
                    tool_name = event.get("toolUse", {}).get("name", "unknown")
                
                if "toolResult" in event:
                    if tool_start_time:
                        tool_duration = time.time() - tool_start_time
                        tool_name = event.get("toolResult", {}).get("toolUseId", "unknown")
                        tool_success = "error" not in event.get("toolResult", {})
                        metrics_collector.record_tool_call(invocation_id, tool_name, tool_duration, tool_success)
                        tool_start_time = None

                # Handle end of stream and extract token usage
                if "result" in event:
                    result = event["result"]
                    # Extract token usage from result metrics
                    if hasattr(result, 'metrics') and hasattr(result.metrics, 'usage'):
                        usage = result.metrics.usage
                        input_tokens = getattr(usage, 'input_tokens', 0)
                        output_tokens = getattr(usage, 'output_tokens', 0)
                        metrics_collector.record_token_usage(invocation_id, input_tokens, output_tokens)
    
    except Exception as e:
        success = False
        metrics_collector.record_error(invocation_id, type(e).__name__, str(e))
        raise
    
    finally:
        # End metrics collection
        metrics_collector.end_invocation(invocation_id, len(response_text), success)

def format_response(result) -> str:
    """Extract code from metrics and format with LLM response."""
    parts = []

    # Extract executed code from metrics
    try:
        tool_metrics = result.metrics.tool_metrics.get('code_interpreter')
        if tool_metrics and hasattr(tool_metrics, 'tool'):
            action = tool_metrics.tool['input']['code_interpreter_input']['action']
            if 'code' in action:
                parts.append(f"## Executed Code:\n```{action.get('language', 'python')}\n{action['code']}\n```\n---\n")
    except (AttributeError, KeyError):
        pass  # No code to extract

    # Add LLM response
    parts.append(f"## 📊 Result:\n{str(result)}")
    return "\n".join(parts)

if __name__ == "__main__":
    app.run()