import React, { useState, useRef, useEffect } from 'react';
import './AgentChatInterface.css';

function AgentChatInterface({ agentUrl = 'http://localhost:8081/invocations', onMetricsUpdate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message to chat
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    setIsLoading(true);

    try {
      const response = await fetch(agentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Agent returned ${response.status}: ${response.statusText}`);
      }

      // Read the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      // Add placeholder for assistant message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        // Update the last message (assistant's response)
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
            timestamp: new Date().toISOString(),
            isStreaming: true
          };
          return newMessages;
        });
      }

      // Mark streaming as complete
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].isStreaming = false;
        return newMessages;
      });

      // Notify parent component to refresh metrics
      if (onMetricsUpdate) {
        setTimeout(() => onMetricsUpdate(), 1000);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'error',
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const examplePrompts = [
    "Hello! What can you do?",
    "What is 25 + 17?",
    "Calculate fibonacci(10) using Python",
    "Explain quantum computing in simple terms"
  ];

  return (
    <div className="agent-chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">🤖</span>
          <div>
            <h3>Demo Bot Agent</h3>
            <p className="session-info">Session: {sessionId.substring(0, 20)}...</p>
          </div>
        </div>
        <button onClick={clearChat} className="clear-button" title="Clear chat">
          🗑️ Clear
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h4>👋 Welcome to WeatherBot!</h4>
            <p>I'm an AI assistant with code execution capabilities. Try asking me:</p>
            <div className="example-prompts">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="example-prompt"
                  onClick={() => setInput(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : message.role === 'error' ? '⚠️' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.content || (message.isStreaming ? '...' : '')}
              </div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}

      <div className="chat-input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send)"
          className="chat-input"
          rows="2"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? '⏳' : '📤'} Send
        </button>
      </div>

      <div className="chat-footer">
        <span className="status-indicator">
          {isLoading ? '🟡 Thinking...' : '🟢 Ready'}
        </span>
        <span className="message-count">
          {messages.filter(m => m.role !== 'error').length} messages
        </span>
      </div>
    </div>
  );
}

export default AgentChatInterface;
