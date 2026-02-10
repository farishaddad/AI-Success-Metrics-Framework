#!/usr/bin/env python3
"""Quick diagnostic for WeatherBot"""

import sys
import socket

def check_port(port=8080):
    """Check if port is open"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0

def test_http():
    """Test HTTP connection"""
    try:
        import requests
        response = requests.post(
            'http://localhost:8080/invocations',
            json={'prompt': 'Hello'},
            timeout=5
        )
        return response.status_code, response.text[:200]
    except Exception as e:
        return None, str(e)

print("=" * 60)
print("🔍 WeatherBot Diagnostic")
print("=" * 60)
print()

# Check if port is open
print("1. Checking port 8080...")
if check_port(8080):
    print("   ✅ Port 8080 is open")
else:
    print("   ❌ Port 8080 is not open")
    print()
    print("   The server is not running. Start it with:")
    print("   python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload")
    sys.exit(1)

print()

# Test HTTP
print("2. Testing HTTP connection...")
status, response = test_http()

if status == 200:
    print(f"   ✅ Server responded: {status}")
    print(f"   Response preview: {response}")
elif status:
    print(f"   ⚠️  Server responded: {status}")
    print(f"   Response: {response}")
else:
    print(f"   ❌ Connection failed: {response}")

print()
print("=" * 60)
print("To test manually, run:")
print("   agentcore invoke --dev 'Hello!'")
print("=" * 60)
