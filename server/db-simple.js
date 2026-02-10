// Simple JSON file-based database (no compilation needed)
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file
const file = join(__dirname, 'database', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {});

// Initialize database
await db.read();
db.data ||= { feedback: [], useCases: [], users: [], agentMetrics: [] };
await db.write();

// Feedback operations
export const feedbackDB = {
  async getAll() {
    await db.read();
    return db.data.feedback || [];
  },

  async create(feedback) {
    await db.read();
    const id = Date.now();
    const newFeedback = { id, ...feedback };
    db.data.feedback.push(newFeedback);
    await db.write();
    return newFeedback;
  },

  async getById(id) {
    await db.read();
    return db.data.feedback.find(f => f.id === parseInt(id));
  },

  async delete(id) {
    await db.read();
    db.data.feedback = db.data.feedback.filter(f => f.id !== parseInt(id));
    await db.write();
  }
};

// Use Case operations
export const useCaseDB = {
  async getAll() {
    await db.read();
    return db.data.useCases || [];
  },

  async create(useCase) {
    await db.read();
    db.data.useCases.push(useCase);
    await db.write();
    return useCase;
  },

  async getById(id) {
    await db.read();
    return db.data.useCases.find(uc => uc.id === id);
  },

  async update(id, useCase) {
    await db.read();
    const index = db.data.useCases.findIndex(uc => uc.id === id);
    if (index !== -1) {
      db.data.useCases[index] = { ...db.data.useCases[index], ...useCase };
      await db.write();
      return db.data.useCases[index];
    }
    return null;
  },

  async delete(id) {
    await db.read();
    db.data.useCases = db.data.useCases.filter(uc => uc.id !== id);
    await db.write();
  }
};

// User operations
export const userDB = {
  async getAll() {
    await db.read();
    return db.data.users || [];
  },

  async create(user) {
    await db.read();
    const id = Date.now();
    const newUser = {
      id,
      ...user,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    db.data.users.push(newUser);
    await db.write();
    return newUser;
  },

  async getById(id) {
    await db.read();
    return db.data.users.find(u => u.id === parseInt(id));
  },

  async getByUsername(username) {
    await db.read();
    return db.data.users.find(u => u.username === username);
  },

  async getByEmail(email) {
    await db.read();
    return db.data.users.find(u => u.email === email);
  },

  async update(id, userData) {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      db.data.users[index] = { 
        ...db.data.users[index], 
        ...userData,
        updatedAt: new Date().toISOString()
      };
      await db.write();
      return db.data.users[index];
    }
    return null;
  },

  async updateLastLogin(id) {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      db.data.users[index].lastLogin = new Date().toISOString();
      await db.write();
      return db.data.users[index];
    }
    return null;
  },

  async delete(id) {
    await db.read();
    db.data.users = db.data.users.filter(u => u.id !== parseInt(id));
    await db.write();
  },

  async toggleActive(id) {
    await db.read();
    const index = db.data.users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      db.data.users[index].isActive = !db.data.users[index].isActive;
      await db.write();
      return db.data.users[index];
    }
    return null;
  }
};

export default db;


// Agent Metrics operations
export const agentMetricsDB = {
  async getAll() {
    await db.read();
    return (db.data.agentMetrics || []).slice(0, 1000); // Limit to last 1000
  },

  async create(metrics) {
    await db.read();
    const id = Date.now();
    const newMetrics = { 
      id, 
      ...metrics,
      created_at: new Date().toISOString()
    };
    db.data.agentMetrics = db.data.agentMetrics || [];
    db.data.agentMetrics.push(newMetrics);
    
    // Keep only last 10000 entries to prevent file from growing too large
    if (db.data.agentMetrics.length > 10000) {
      db.data.agentMetrics = db.data.agentMetrics.slice(-10000);
    }
    
    await db.write();
    return newMetrics;
  },

  async getBySessionId(sessionId) {
    await db.read();
    return (db.data.agentMetrics || []).filter(m => m.session_id === sessionId);
  },

  async getSummary(startDate, endDate) {
    await db.read();
    let metrics = db.data.agentMetrics || [];
    
    // Filter by date range if provided
    if (startDate || endDate) {
      metrics = metrics.filter(m => {
        const metricDate = new Date(m.start_timestamp);
        if (startDate && metricDate < new Date(startDate)) return false;
        if (endDate && metricDate > new Date(endDate)) return false;
        return true;
      });
    }
    
    if (metrics.length === 0) {
      return {
        total_invocations: 0,
        total_input_tokens: 0,
        total_output_tokens: 0,
        total_cost: 0,
        avg_duration_ms: 0,
        avg_input_tokens: 0,
        avg_output_tokens: 0,
        successful_invocations: 0,
        failed_invocations: 0,
        total_tool_calls: 0,
        total_errors: 0,
        unique_sessions: 0,
        success_rate: 0,
        hourly_breakdown: []
      };
    }
    
    const totalInvocations = metrics.length;
    const successfulInvocations = metrics.filter(m => m.success).length;
    const failedInvocations = totalInvocations - successfulInvocations;
    
    const summary = {
      total_invocations: totalInvocations,
      total_input_tokens: metrics.reduce((sum, m) => sum + (m.tokens_input || 0), 0),
      total_output_tokens: metrics.reduce((sum, m) => sum + (m.tokens_output || 0), 0),
      total_cost: metrics.reduce((sum, m) => sum + (m.cost_usd || 0), 0),
      avg_duration_ms: metrics.reduce((sum, m) => sum + (m.duration_ms || 0), 0) / totalInvocations,
      avg_input_tokens: metrics.reduce((sum, m) => sum + (m.tokens_input || 0), 0) / totalInvocations,
      avg_output_tokens: metrics.reduce((sum, m) => sum + (m.tokens_output || 0), 0) / totalInvocations,
      successful_invocations: successfulInvocations,
      failed_invocations: failedInvocations,
      total_tool_calls: metrics.reduce((sum, m) => sum + (m.tool_count || 0), 0),
      total_errors: metrics.reduce((sum, m) => sum + (m.error_count || 0), 0),
      unique_sessions: new Set(metrics.map(m => m.session_id)).size,
      first_invocation: metrics[0]?.start_timestamp,
      last_invocation: metrics[metrics.length - 1]?.start_timestamp,
      success_rate: ((successfulInvocations / totalInvocations) * 100).toFixed(2)
    };
    
    // Calculate hourly breakdown
    const hourlyMap = {};
    metrics.forEach(m => {
      const hour = new Date(m.start_timestamp).toISOString().substring(0, 13) + ':00:00';
      if (!hourlyMap[hour]) {
        hourlyMap[hour] = {
          hour,
          invocations: 0,
          cost: 0,
          totalDuration: 0
        };
      }
      hourlyMap[hour].invocations++;
      hourlyMap[hour].cost += m.cost_usd || 0;
      hourlyMap[hour].totalDuration += m.duration_ms || 0;
    });
    
    summary.hourly_breakdown = Object.values(hourlyMap)
      .map(h => ({
        ...h,
        avg_duration: h.invocations > 0 ? h.totalDuration / h.invocations : 0
      }))
      .sort((a, b) => new Date(b.hour) - new Date(a.hour))
      .slice(0, 24);
    
    return summary;
  },

  async delete(id) {
    await db.read();
    db.data.agentMetrics = (db.data.agentMetrics || []).filter(m => m.id !== parseInt(id));
    await db.write();
  }
};
