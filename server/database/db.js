import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'ai-metrics.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database with schema
export function initializeDatabase() {
  const schemaPath = join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Execute schema
  db.exec(schema);
  
  console.log('✅ Database initialized successfully');
}

// Feedback operations
export const feedbackDB = {
  create(feedback) {
    const stmt = db.prepare(`
      INSERT INTO feedback (page_name, submission_date, user_name, user_email, details, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      feedback.pageName,
      feedback.date,
      feedback.name || null,
      feedback.email || null,
      feedback.details,
      feedback.timestamp
    );
    
    return { id: result.lastInsertRowid, ...feedback };
  },

  getAll() {
    const stmt = db.prepare('SELECT * FROM feedback ORDER BY timestamp DESC');
    return stmt.all();
  },

  getById(id) {
    const stmt = db.prepare('SELECT * FROM feedback WHERE id = ?');
    return stmt.get(id);
  },

  getByPage(pageName) {
    const stmt = db.prepare('SELECT * FROM feedback WHERE page_name = ? ORDER BY timestamp DESC');
    return stmt.all(pageName);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM feedback WHERE id = ?');
    return stmt.run(id);
  },

  search(searchTerm) {
    const stmt = db.prepare(`
      SELECT * FROM feedback 
      WHERE details LIKE ? OR user_name LIKE ? OR page_name LIKE ?
      ORDER BY timestamp DESC
    `);
    const term = `%${searchTerm}%`;
    return stmt.all(term, term, term);
  }
};

// Use Case operations
export const useCaseDB = {
  create(useCase) {
    const stmt = db.prepare(`
      INSERT INTO use_cases (id, name, status, business_context, problem_statement, target_audience, success_criteria)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      useCase.id,
      useCase.name,
      useCase.status,
      useCase.businessContext || null,
      useCase.problemStatement || null,
      useCase.targetAudience || null,
      useCase.successCriteria || null
    );
    
    return useCase;
  },

  getAll() {
    const stmt = db.prepare('SELECT * FROM use_cases ORDER BY created_at DESC');
    return stmt.all();
  },

  getById(id) {
    const stmt = db.prepare('SELECT * FROM use_cases WHERE id = ?');
    return stmt.get(id);
  },

  update(id, useCase) {
    const stmt = db.prepare(`
      UPDATE use_cases 
      SET name = ?, status = ?, business_context = ?, problem_statement = ?, 
          target_audience = ?, success_criteria = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      useCase.name,
      useCase.status,
      useCase.businessContext || null,
      useCase.problemStatement || null,
      useCase.targetAudience || null,
      useCase.successCriteria || null,
      id
    );
    
    return this.getById(id);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM use_cases WHERE id = ?');
    return stmt.run(id);
  }
};

// KPI operations
export const kpiDB = {
  create(kpi) {
    const stmt = db.prepare(`
      INSERT INTO kpis (use_case_id, category, metric_name, baseline, target, measurement_frequency, data_source)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      kpi.useCaseId,
      kpi.category,
      kpi.metricName,
      kpi.baseline || null,
      kpi.target || null,
      kpi.measurementFrequency || null,
      kpi.dataSource || null
    );
    
    return { id: result.lastInsertRowid, ...kpi };
  },

  getByUseCaseId(useCaseId) {
    const stmt = db.prepare('SELECT * FROM kpis WHERE use_case_id = ?');
    return stmt.all(useCaseId);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM kpis WHERE id = ?');
    return stmt.run(id);
  }
};

// Data Requirements operations
export const dataRequirementDB = {
  create(dataReq) {
    const stmt = db.prepare(`
      INSERT INTO data_requirements (use_case_id, data_type, source_system, volume, frequency, quality_level, availability)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      dataReq.useCaseId,
      dataReq.dataType,
      dataReq.sourceSystem || null,
      dataReq.volume || null,
      dataReq.frequency || null,
      dataReq.qualityLevel || null,
      dataReq.availability || null
    );
    
    return { id: result.lastInsertRowid, ...dataReq };
  },

  getByUseCaseId(useCaseId) {
    const stmt = db.prepare('SELECT * FROM data_requirements WHERE use_case_id = ?');
    return stmt.all(useCaseId);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM data_requirements WHERE id = ?');
    return stmt.run(id);
  }
};

// Risk operations
export const riskDB = {
  create(risk) {
    const stmt = db.prepare(`
      INSERT INTO risks (use_case_id, category, description, likelihood, impact, mitigation)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      risk.useCaseId,
      risk.category,
      risk.description || null,
      risk.likelihood || null,
      risk.impact || null,
      risk.mitigation || null
    );
    
    return { id: result.lastInsertRowid, ...risk };
  },

  getByUseCaseId(useCaseId) {
    const stmt = db.prepare('SELECT * FROM risks WHERE use_case_id = ?');
    return stmt.all(useCaseId);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM risks WHERE id = ?');
    return stmt.run(id);
  }
};

// Stakeholder operations
export const stakeholderDB = {
  create(stakeholder) {
    const stmt = db.prepare(`
      INSERT INTO stakeholders (use_case_id, role, name, responsibility, engagement_level)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      stakeholder.useCaseId,
      stakeholder.role,
      stakeholder.name || null,
      stakeholder.responsibility || null,
      stakeholder.engagementLevel || null
    );
    
    return { id: result.lastInsertRowid, ...stakeholder };
  },

  getByUseCaseId(useCaseId) {
    const stmt = db.prepare('SELECT * FROM stakeholders WHERE use_case_id = ?');
    return stmt.all(useCaseId);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM stakeholders WHERE id = ?');
    return stmt.run(id);
  }
};

// Milestone operations
export const milestoneDB = {
  create(milestone) {
    const stmt = db.prepare(`
      INSERT INTO milestones (use_case_id, phase, key_activities, duration, target_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      milestone.useCaseId,
      milestone.phase,
      milestone.keyActivities || null,
      milestone.duration || null,
      milestone.targetDate || null,
      milestone.status || null
    );
    
    return { id: result.lastInsertRowid, ...milestone };
  },

  getByUseCaseId(useCaseId) {
    const stmt = db.prepare('SELECT * FROM milestones WHERE use_case_id = ?');
    return stmt.all(useCaseId);
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM milestones WHERE id = ?');
    return stmt.run(id);
  }
};

// Export database instance for custom queries
export default db;


// Agent Metrics operations
export const agentMetricsDB = {
  create(metrics) {
    const stmt = db.prepare(`
      INSERT INTO agent_metrics (
        invocation_id, session_id, agent_name, model, prompt,
        start_timestamp, end_timestamp, duration_ms, duration_seconds,
        tokens_input, tokens_output, cost_usd, cost_input_usd, cost_output_usd,
        response_length, tool_count, error_count, success, tool_calls, errors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      metrics.invocation_id,
      metrics.session_id,
      metrics.agent_name,
      metrics.model,
      metrics.prompt || null,
      metrics.start_timestamp,
      metrics.end_timestamp,
      metrics.duration_ms,
      metrics.duration_seconds,
      metrics.tokens_input || 0,
      metrics.tokens_output || 0,
      metrics.cost_usd || 0,
      metrics.cost_input_usd || 0,
      metrics.cost_output_usd || 0,
      metrics.response_length || 0,
      metrics.tool_count || 0,
      metrics.error_count || 0,
      metrics.success ? 1 : 0,
      JSON.stringify(metrics.tool_calls || []),
      JSON.stringify(metrics.errors || [])
    );
    
    return { id: result.lastInsertRowid, ...metrics };
  },

  getAll() {
    const stmt = db.prepare('SELECT * FROM agent_metrics ORDER BY start_timestamp DESC LIMIT 1000');
    const rows = stmt.all();
    return rows.map(row => ({
      ...row,
      tool_calls: JSON.parse(row.tool_calls || '[]'),
      errors: JSON.parse(row.errors || '[]'),
      success: Boolean(row.success)
    }));
  },

  getById(id) {
    const stmt = db.prepare('SELECT * FROM agent_metrics WHERE id = ?');
    const row = stmt.get(id);
    if (row) {
      return {
        ...row,
        tool_calls: JSON.parse(row.tool_calls || '[]'),
        errors: JSON.parse(row.errors || '[]'),
        success: Boolean(row.success)
      };
    }
    return null;
  },

  getBySessionId(sessionId) {
    const stmt = db.prepare('SELECT * FROM agent_metrics WHERE session_id = ? ORDER BY start_timestamp DESC');
    const rows = stmt.all(sessionId);
    return rows.map(row => ({
      ...row,
      tool_calls: JSON.parse(row.tool_calls || '[]'),
      errors: JSON.parse(row.errors || '[]'),
      success: Boolean(row.success)
    }));
  },

  getSummary(startDate, endDate) {
    let query = `
      SELECT 
        COUNT(*) as total_invocations,
        SUM(tokens_input) as total_input_tokens,
        SUM(tokens_output) as total_output_tokens,
        SUM(cost_usd) as total_cost,
        AVG(duration_ms) as avg_duration_ms,
        AVG(tokens_input) as avg_input_tokens,
        AVG(tokens_output) as avg_output_tokens,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_invocations,
        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_invocations,
        SUM(tool_count) as total_tool_calls,
        SUM(error_count) as total_errors,
        COUNT(DISTINCT session_id) as unique_sessions,
        MIN(start_timestamp) as first_invocation,
        MAX(start_timestamp) as last_invocation
      FROM agent_metrics
    `;
    
    const params = [];
    if (startDate && endDate) {
      query += ' WHERE start_timestamp BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE start_timestamp >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE start_timestamp <= ?';
      params.push(endDate);
    }
    
    const stmt = db.prepare(query);
    const summary = stmt.get(...params);
    
    // Get hourly breakdown
    const hourlyStmt = db.prepare(`
      SELECT 
        strftime('%Y-%m-%d %H:00:00', start_timestamp) as hour,
        COUNT(*) as invocations,
        SUM(cost_usd) as cost,
        AVG(duration_ms) as avg_duration
      FROM agent_metrics
      ${startDate || endDate ? 'WHERE ' + (startDate && endDate ? 'start_timestamp BETWEEN ? AND ?' : startDate ? 'start_timestamp >= ?' : 'start_timestamp <= ?') : ''}
      GROUP BY hour
      ORDER BY hour DESC
      LIMIT 24
    `);
    
    const hourlyData = hourlyStmt.all(...params);
    
    return {
      ...summary,
      success_rate: summary.total_invocations > 0 
        ? (summary.successful_invocations / summary.total_invocations * 100).toFixed(2) 
        : 0,
      hourly_breakdown: hourlyData
    };
  },

  delete(id) {
    const stmt = db.prepare('DELETE FROM agent_metrics WHERE id = ?');
    stmt.run(id);
  },

  deleteBySessionId(sessionId) {
    const stmt = db.prepare('DELETE FROM agent_metrics WHERE session_id = ?');
    stmt.run(sessionId);
  }
};
