import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { 
  initializeDatabase, 
  feedbackDB, 
  useCaseDB, 
  kpiDB, 
  dataRequirementDB,
  riskDB,
  stakeholderDB,
  milestoneDB,
  agentMetricsDB
} from './database/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ==================== FEEDBACK ROUTES ====================

// Get all feedback
app.get('/api/feedback', (req, res) => {
  try {
    const feedback = feedbackDB.getAll();
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback by ID
app.get('/api/feedback/:id', (req, res) => {
  try {
    const feedback = feedbackDB.getById(req.params.id);
    if (feedback) {
      res.json(feedback);
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Get feedback by page
app.get('/api/feedback/page/:pageName', (req, res) => {
  try {
    const feedback = feedbackDB.getByPage(req.params.pageName);
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Search feedback
app.get('/api/feedback/search/:term', (req, res) => {
  try {
    const feedback = feedbackDB.search(req.params.term);
    res.json(feedback);
  } catch (error) {
    console.error('Error searching feedback:', error);
    res.status(500).json({ error: 'Failed to search feedback' });
  }
});

// Create feedback
app.post('/api/feedback', (req, res) => {
  try {
    const feedback = feedbackDB.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// Delete feedback
app.delete('/api/feedback/:id', (req, res) => {
  try {
    feedbackDB.delete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// ==================== USE CASE ROUTES ====================

// Get all use cases
app.get('/api/usecases', (req, res) => {
  try {
    const useCases = useCaseDB.getAll();
    res.json(useCases);
  } catch (error) {
    console.error('Error fetching use cases:', error);
    res.status(500).json({ error: 'Failed to fetch use cases' });
  }
});

// Get use case by ID with all related data
app.get('/api/usecases/:id', (req, res) => {
  try {
    const useCase = useCaseDB.getById(req.params.id);
    if (!useCase) {
      return res.status(404).json({ error: 'Use case not found' });
    }

    // Get all related data
    const kpis = kpiDB.getByUseCaseId(req.params.id);
    const dataRequirements = dataRequirementDB.getByUseCaseId(req.params.id);
    const risks = riskDB.getByUseCaseId(req.params.id);
    const stakeholders = stakeholderDB.getByUseCaseId(req.params.id);
    const milestones = milestoneDB.getByUseCaseId(req.params.id);

    res.json({
      ...useCase,
      kpis,
      dataRequirements,
      risks,
      stakeholders,
      milestones
    });
  } catch (error) {
    console.error('Error fetching use case:', error);
    res.status(500).json({ error: 'Failed to fetch use case' });
  }
});

// Create use case
app.post('/api/usecases', (req, res) => {
  try {
    const { useCase, kpis, dataRequirements, risks, stakeholders, milestones } = req.body;
    
    // Create use case
    const createdUseCase = useCaseDB.create(useCase);

    // Create related data
    const createdKpis = kpis?.map(kpi => kpiDB.create({ ...kpi, useCaseId: useCase.id })) || [];
    const createdDataReqs = dataRequirements?.map(dr => dataRequirementDB.create({ ...dr, useCaseId: useCase.id })) || [];
    const createdRisks = risks?.map(risk => riskDB.create({ ...risk, useCaseId: useCase.id })) || [];
    const createdStakeholders = stakeholders?.map(sh => stakeholderDB.create({ ...sh, useCaseId: useCase.id })) || [];
    const createdMilestones = milestones?.map(ms => milestoneDB.create({ ...ms, useCaseId: useCase.id })) || [];

    res.status(201).json({
      ...createdUseCase,
      kpis: createdKpis,
      dataRequirements: createdDataReqs,
      risks: createdRisks,
      stakeholders: createdStakeholders,
      milestones: createdMilestones
    });
  } catch (error) {
    console.error('Error creating use case:', error);
    res.status(500).json({ error: 'Failed to create use case' });
  }
});

// Update use case
app.put('/api/usecases/:id', (req, res) => {
  try {
    const updatedUseCase = useCaseDB.update(req.params.id, req.body);
    res.json(updatedUseCase);
  } catch (error) {
    console.error('Error updating use case:', error);
    res.status(500).json({ error: 'Failed to update use case' });
  }
});

// Delete use case
app.delete('/api/usecases/:id', (req, res) => {
  try {
    useCaseDB.delete(req.params.id);
    res.json({ message: 'Use case deleted successfully' });
  } catch (error) {
    console.error('Error deleting use case:', error);
    res.status(500).json({ error: 'Failed to delete use case' });
  }
});

// ==================== KPI ROUTES ====================

app.get('/api/usecases/:id/kpis', (req, res) => {
  try {
    const kpis = kpiDB.getByUseCaseId(req.params.id);
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

app.post('/api/kpis', (req, res) => {
  try {
    const kpi = kpiDB.create(req.body);
    res.status(201).json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create KPI' });
  }
});

// ==================== DATA REQUIREMENTS ROUTES ====================

app.get('/api/usecases/:id/data-requirements', (req, res) => {
  try {
    const dataReqs = dataRequirementDB.getByUseCaseId(req.params.id);
    res.json(dataReqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data requirements' });
  }
});

app.post('/api/data-requirements', (req, res) => {
  try {
    const dataReq = dataRequirementDB.create(req.body);
    res.status(201).json(dataReq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create data requirement' });
  }
});

// ==================== RISK ROUTES ====================

app.get('/api/usecases/:id/risks', (req, res) => {
  try {
    const risks = riskDB.getByUseCaseId(req.params.id);
    res.json(risks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch risks' });
  }
});

app.post('/api/risks', (req, res) => {
  try {
    const risk = riskDB.create(req.body);
    res.status(201).json(risk);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create risk' });
  }
});

// ==================== STAKEHOLDER ROUTES ====================

app.get('/api/usecases/:id/stakeholders', (req, res) => {
  try {
    const stakeholders = stakeholderDB.getByUseCaseId(req.params.id);
    res.json(stakeholders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stakeholders' });
  }
});

app.post('/api/stakeholders', (req, res) => {
  try {
    const stakeholder = stakeholderDB.create(req.body);
    res.status(201).json(stakeholder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stakeholder' });
  }
});

// ==================== MILESTONE ROUTES ====================

app.get('/api/usecases/:id/milestones', (req, res) => {
  try {
    const milestones = milestoneDB.getByUseCaseId(req.params.id);
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
});

app.post('/api/milestones', (req, res) => {
  try {
    const milestone = milestoneDB.create(req.body);
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create milestone' });
  }
});

// ==================== BULK OPERATIONS ====================

// Export all data
app.get('/api/export', (req, res) => {
  try {
    const data = {
      feedback: feedbackDB.getAll(),
      useCases: useCaseDB.getAll(),
      exportDate: new Date().toISOString()
    };
    res.json(data);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// ==================== AGENT METRICS ROUTES ====================

// Get all agent metrics
app.get('/api/agent-metrics', (req, res) => {
  try {
    const metrics = agentMetricsDB.getAll();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching agent metrics:', error);
    res.status(500).json({ error: 'Failed to fetch agent metrics' });
  }
});

// Get agent metrics by session ID
app.get('/api/agent-metrics/session/:sessionId', (req, res) => {
  try {
    const metrics = agentMetricsDB.getBySessionId(req.params.sessionId);
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching session metrics:', error);
    res.status(500).json({ error: 'Failed to fetch session metrics' });
  }
});

// Get agent metrics summary
app.get('/api/agent-metrics/summary', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = agentMetricsDB.getSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    console.error('Error fetching metrics summary:', error);
    res.status(500).json({ error: 'Failed to fetch metrics summary' });
  }
});

// Create agent metrics
app.post('/api/agent-metrics', (req, res) => {
  try {
    const metrics = agentMetricsDB.create(req.body);
    res.status(201).json(metrics);
  } catch (error) {
    console.error('Error creating agent metrics:', error);
    res.status(500).json({ error: 'Failed to create agent metrics' });
  }
});

// Delete agent metrics
app.delete('/api/agent-metrics/:id', (req, res) => {
  try {
    agentMetricsDB.delete(req.params.id);
    res.json({ message: 'Agent metrics deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent metrics:', error);
    res.status(500).json({ error: 'Failed to delete agent metrics' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
