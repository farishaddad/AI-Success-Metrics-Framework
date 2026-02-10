-- AI Success Metrics Dashboard Database Schema

-- Feedback/Suggestions Table
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_name TEXT NOT NULL,
    submission_date DATE NOT NULL,
    user_name TEXT,
    user_email TEXT,
    details TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Use Cases Table
CREATE TABLE IF NOT EXISTS use_cases (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    business_context TEXT,
    problem_statement TEXT,
    target_audience TEXT,
    success_criteria TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- KPIs Table (linked to use cases)
CREATE TABLE IF NOT EXISTS kpis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    use_case_id TEXT NOT NULL,
    category TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    baseline TEXT,
    target TEXT,
    measurement_frequency TEXT,
    data_source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE
);

-- Data Requirements Table (linked to use cases)
CREATE TABLE IF NOT EXISTS data_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    use_case_id TEXT NOT NULL,
    data_type TEXT NOT NULL,
    source_system TEXT,
    volume TEXT,
    frequency TEXT,
    quality_level TEXT,
    availability TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE
);

-- Risk Assessment Table (linked to use cases)
CREATE TABLE IF NOT EXISTS risks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    use_case_id TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    likelihood TEXT,
    impact TEXT,
    mitigation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE
);

-- Stakeholders Table (linked to use cases)
CREATE TABLE IF NOT EXISTS stakeholders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    use_case_id TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT,
    responsibility TEXT,
    engagement_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE
);

-- Timeline/Milestones Table (linked to use cases)
CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    use_case_id TEXT NOT NULL,
    phase TEXT NOT NULL,
    key_activities TEXT,
    duration TEXT,
    target_date DATE,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (use_case_id) REFERENCES use_cases(id) ON DELETE CASCADE
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    preference_key TEXT NOT NULL,
    preference_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, preference_key)
);

-- Agent Metrics Table
CREATE TABLE IF NOT EXISTS agent_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invocation_id TEXT UNIQUE NOT NULL,
    session_id TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    model TEXT NOT NULL,
    prompt TEXT,
    start_timestamp DATETIME NOT NULL,
    end_timestamp DATETIME NOT NULL,
    duration_ms REAL NOT NULL,
    duration_seconds REAL NOT NULL,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    cost_usd REAL DEFAULT 0,
    cost_input_usd REAL DEFAULT 0,
    cost_output_usd REAL DEFAULT 0,
    response_length INTEGER DEFAULT 0,
    tool_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    success BOOLEAN DEFAULT 1,
    tool_calls TEXT,  -- JSON array of tool calls
    errors TEXT,      -- JSON array of errors
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_page ON feedback(page_name);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_use_cases_status ON use_cases(status);
CREATE INDEX IF NOT EXISTS idx_kpis_use_case ON kpis(use_case_id);
CREATE INDEX IF NOT EXISTS idx_data_req_use_case ON data_requirements(use_case_id);
CREATE INDEX IF NOT EXISTS idx_risks_use_case ON risks(use_case_id);
CREATE INDEX IF NOT EXISTS idx_stakeholders_use_case ON stakeholders(use_case_id);
CREATE INDEX IF NOT EXISTS idx_milestones_use_case ON milestones(use_case_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_session ON agent_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_timestamp ON agent_metrics(start_timestamp);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent ON agent_metrics(agent_name);
