#!/usr/bin/env python3
"""Test agent metrics API endpoints"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:3001/api"

def test_health():
    """Test health endpoint"""
    print("1️⃣  Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_get_summary():
    """Test get summary endpoint"""
    print("\n2️⃣  Testing metrics summary endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/agent-metrics/summary", timeout=5)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Total invocations: {data.get('total_invocations', 0)}")
        print(f"   Total cost: ${data.get('total_cost', 0):.4f}")
        return response.status_code == 200
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_create_metric():
    """Test create metric endpoint"""
    print("\n3️⃣  Testing create metric endpoint...")
    
    test_metric = {
        "invocation_id": f"test_{int(datetime.now().timestamp())}",
        "session_id": "test_session_123",
        "agent_name": "WeatherBot",
        "model": "claude-sonnet-4.5",
        "prompt": "Hello! What can you do?",
        "start_timestamp": datetime.utcnow().isoformat() + "Z",
        "end_timestamp": datetime.utcnow().isoformat() + "Z",
        "duration_ms": 1500,
        "duration_seconds": 1.5,
        "tokens_input": 100,
        "tokens_output": 200,
        "cost_usd": 0.0033,
        "cost_input_usd": 0.0003,
        "cost_output_usd": 0.003,
        "response_length": 500,
        "tool_count": 1,
        "error_count": 0,
        "success": True,
        "tool_calls": [{"tool_name": "add_numbers", "duration_ms": 50, "success": True}],
        "errors": []
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/agent-metrics",
            json=test_metric,
            timeout=5
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"   ✅ Created metric with ID: {data.get('id')}")
            return True
        else:
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_get_all_metrics():
    """Test get all metrics endpoint"""
    print("\n4️⃣  Testing get all metrics endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/agent-metrics", timeout=5)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Found {len(data)} metrics")
        if len(data) > 0:
            print(f"   Latest metric: {data[0].get('invocation_id', 'N/A')}")
        return response.status_code == 200
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_get_summary_with_data():
    """Test get summary with data"""
    print("\n5️⃣  Testing summary with data...")
    try:
        response = requests.get(f"{BASE_URL}/agent-metrics/summary", timeout=5)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Total invocations: {data.get('total_invocations', 0)}")
        print(f"   Total cost: ${data.get('total_cost', 0):.4f}")
        print(f"   Success rate: {data.get('success_rate', 0)}%")
        print(f"   Avg duration: {data.get('avg_duration_ms', 0):.2f}ms")
        return response.status_code == 200
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("=" * 60)
    print("🧪 Agent Metrics API Test Suite")
    print("=" * 60)
    print()
    
    tests = [
        ("Health Check", test_health),
        ("Get Summary (empty)", test_get_summary),
        ("Create Metric", test_create_metric),
        ("Get All Metrics", test_get_all_metrics),
        ("Get Summary (with data)", test_get_summary_with_data)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"   ❌ Test failed with exception: {e}")
            results.append((name, False))
    
    print()
    print("=" * 60)
    print("📊 Test Results")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status} - {name}")
    
    print()
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    exit(main())
