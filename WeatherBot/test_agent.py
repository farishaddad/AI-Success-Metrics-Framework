#!/usr/bin/env python3
"""
Simple test script to verify WeatherBot agent setup
"""

import sys
import os

def check_dependencies():
    """Check if all required packages are installed"""
    print("🔍 Checking dependencies...")
    
    required_packages = [
        'bedrock_agentcore',
        'strands',
        'boto3',
        'uvicorn',
        'starlette'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} - MISSING")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("   Run: pip3 install -e .")
        return False
    
    print("   All dependencies installed!\n")
    return True

def check_aws_credentials():
    """Check if AWS credentials are configured"""
    print("🔍 Checking AWS credentials...")
    
    try:
        import boto3
        sts = boto3.client('sts')
        identity = sts.get_caller_identity()
        print(f"   ✅ AWS Account: {identity['Account']}")
        print(f"   ✅ User ARN: {identity['Arn']}\n")
        return True
    except Exception as e:
        print(f"   ❌ AWS credentials not configured")
        print(f"   Error: {str(e)}")
        print("   Run: aws configure")
        print("   See: AWS_CREDENTIALS_SETUP.md\n")
        return False

def check_bedrock_access():
    """Check if Bedrock model access is enabled"""
    print("🔍 Checking Bedrock access...")
    
    try:
        import boto3
        bedrock = boto3.client('bedrock', region_name='us-east-1')
        
        # Try to list foundation models
        response = bedrock.list_foundation_models()
        
        # Check for Claude models
        claude_models = [m for m in response['modelSummaries'] 
                        if 'claude' in m['modelId'].lower()]
        
        if claude_models:
            print(f"   ✅ Found {len(claude_models)} Claude models")
            print("   ✅ Bedrock access configured\n")
            return True
        else:
            print("   ⚠️  No Claude models found")
            print("   Enable model access in Bedrock console\n")
            return False
            
    except Exception as e:
        print(f"   ❌ Cannot access Bedrock")
        print(f"   Error: {str(e)}")
        print("   Check region and permissions\n")
        return False

def test_agent_import():
    """Test if the agent can be imported"""
    print("🔍 Testing agent import...")
    
    try:
        # Add src to path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))
        
        from main import app
        print("   ✅ Agent imported successfully")
        print(f"   ✅ App type: {type(app)}\n")
        return True
    except Exception as e:
        print(f"   ❌ Failed to import agent")
        print(f"   Error: {str(e)}\n")
        return False

def main():
    """Run all checks"""
    print("=" * 60)
    print("🤖 WeatherBot Agent - System Check")
    print("=" * 60)
    print()
    
    checks = [
        ("Dependencies", check_dependencies),
        ("AWS Credentials", check_aws_credentials),
        ("Bedrock Access", check_bedrock_access),
        ("Agent Import", test_agent_import)
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"   ❌ Unexpected error: {str(e)}\n")
            results.append((name, False))
    
    print("=" * 60)
    print("📊 Summary")
    print("=" * 60)
    
    all_passed = True
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {status} - {name}")
        if not passed:
            all_passed = False
    
    print()
    
    if all_passed:
        print("🎉 All checks passed! Ready to run the agent.")
        print()
        print("To start the agent:")
        print("   python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload")
        print()
        print("To test the agent:")
        print("   agentcore invoke --dev 'Hello! What can you do?'")
        return 0
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print()
        print("Quick fixes:")
        print("   1. Install dependencies: pip3 install -e .")
        print("   2. Configure AWS: aws configure")
        print("   3. Enable Bedrock models in AWS Console")
        print("   4. See AWS_CREDENTIALS_SETUP.md for detailed instructions")
        return 1

if __name__ == "__main__":
    sys.exit(main())
