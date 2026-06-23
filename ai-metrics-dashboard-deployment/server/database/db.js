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
