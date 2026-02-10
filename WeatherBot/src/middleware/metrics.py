"""
Metrics collection middleware for WeatherBot agent
Captures performance, cost, and observability metrics
"""

import time
import json
import os
from datetime import datetime
from typing import Dict, Any
import requests

class MetricsCollector:
    """Collects and sends metrics to the dashboard backend"""
    
    def __init__(self, dashboard_url: str = None):
        self.dashboard_url = dashboard_url or os.getenv('DASHBOARD_API_URL', 'http://localhost:3001/api')
        self.session_metrics = {}
        
    def start_invocation(self, session_id: str, prompt: str) -> Dict[str, Any]:
        """Start tracking an invocation"""
        invocation_id = f"{session_id}_{int(time.time() * 1000)}"
        
        self.session_metrics[invocation_id] = {
            'invocation_id': invocation_id,
            'session_id': session_id,
            'prompt': prompt[:200],  # Truncate for storage
            'start_time': time.time(),
            'start_timestamp': datetime.utcnow().isoformat(),
            'tokens_input': 0,
            'tokens_output': 0,
            'tool_calls': [],
            'errors': []
        }
        
        return {'invocation_id': invocation_id}
    
    def record_token_usage(self, invocation_id: str, input_tokens: int, output_tokens: int):
        """Record token usage for cost calculation"""
        if invocation_id in self.session_metrics:
            self.session_metrics[invocation_id]['tokens_input'] += input_tokens
            self.session_metrics[invocation_id]['tokens_output'] += output_tokens
    
    def record_tool_call(self, invocation_id: str, tool_name: str, duration: float, success: bool):
        """Record tool execution"""
        if invocation_id in self.session_metrics:
            self.session_metrics[invocation_id]['tool_calls'].append({
                'tool_name': tool_name,
                'duration_ms': duration * 1000,
                'success': success,
                'timestamp': datetime.utcnow().isoformat()
            })
    
    def record_error(self, invocation_id: str, error_type: str, error_message: str):
        """Record errors"""
        if invocation_id in self.session_metrics:
            self.session_metrics[invocation_id]['errors'].append({
                'error_type': error_type,
                'error_message': error_message,
                'timestamp': datetime.utcnow().isoformat()
            })
    
    def end_invocation(self, invocation_id: str, response_length: int = 0, success: bool = True):
        """End tracking and send metrics to dashboard"""
        if invocation_id not in self.session_metrics:
            return
        
        metrics = self.session_metrics[invocation_id]
        end_time = time.time()
        duration = end_time - metrics['start_time']
        
        # Calculate costs (Claude Sonnet 4.5 pricing)
        input_cost = (metrics['tokens_input'] / 1000) * 0.003  # $0.003 per 1K input tokens
        output_cost = (metrics['tokens_output'] / 1000) * 0.015  # $0.015 per 1K output tokens
        total_cost = input_cost + output_cost
        
        # Prepare final metrics
        final_metrics = {
            **metrics,
            'end_time': end_time,
            'end_timestamp': datetime.utcnow().isoformat(),
            'duration_ms': duration * 1000,
            'duration_seconds': duration,
            'response_length': response_length,
            'success': success,
            'cost_usd': total_cost,
            'cost_input_usd': input_cost,
            'cost_output_usd': output_cost,
            'model': 'claude-sonnet-4.5',
            'agent_name': 'WeatherBot',
            'tool_count': len(metrics['tool_calls']),
            'error_count': len(metrics['errors'])
        }
        
        # Send to dashboard
        self._send_to_dashboard(final_metrics)
        
        # Clean up
        del self.session_metrics[invocation_id]
        
        return final_metrics
    
    def _send_to_dashboard(self, metrics: Dict[str, Any]):
        """Send metrics to dashboard backend"""
        try:
            response = requests.post(
                f"{self.dashboard_url}/agent-metrics",
                json=metrics,
                timeout=5
            )
            if response.status_code != 201:
                print(f"Warning: Failed to send metrics to dashboard: {response.status_code}")
        except Exception as e:
            print(f"Warning: Could not send metrics to dashboard: {e}")
            # Don't fail the agent if dashboard is unavailable
    
    def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        """Get summary metrics for a session"""
        # This would query the dashboard API for historical data
        try:
            response = requests.get(
                f"{self.dashboard_url}/agent-metrics/session/{session_id}",
                timeout=5
            )
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"Warning: Could not fetch session summary: {e}")
        
        return {}


# Global metrics collector instance
metrics_collector = MetricsCollector()
