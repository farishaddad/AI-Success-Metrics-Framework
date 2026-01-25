import React, { useState } from 'react';
import FeedbackButton from './FeedbackButton';
import './UseCaseRegistry.css';

const UseCaseRegistry = ({ onFeedbackSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [useCases, setUseCases] = useState([
    {
      id: 'UC-001',
      name: 'Customer Service Chatbot',
      status: 'Production',
      owner: 'Sarah Johnson',
      dateCreated: '2025-09-15',
      aiType: 'Generative AI',
      roi: '145%',
      businessObjective: 'Customer Experience',
      kpis: {
        csat: { baseline: '72%', target: '85%', current: '83%' },
        resolutionTime: { baseline: '12 min', target: '5 min', current: '6 min' },
        costSavings: { baseline: '$0', target: '$500K', current: '$425K' }
      }
    },
    {
      id: 'UC-002',
      name: 'Predictive Maintenance',
      status: 'Pilot',
      owner: 'Michael Chen',
      dateCreated: '2025-11-20',
      aiType: 'Predictive ML',
      roi: '78%',
      businessObjective: 'Operational Efficiency',
      kpis: {
        downtime: { baseline: '120 hrs', target: '40 hrs', current: '65 hrs' },
        accuracy: { baseline: 'N/A', target: '95%', current: '92%' },
        costAvoidance: { baseline: '$0', target: '$1.2M', current: '$780K' }
      }
    },
    {
      id: 'UC-003',
      name: 'Fraud Detection System',
      status: 'Production',
      owner: 'Emily Rodriguez',
      dateCreated: '2025-08-10',
      aiType: 'Predictive ML',
      roi: '220%',
      businessObjective: 'Risk Reduction',
      kpis: {
        fraudDetection: { baseline: '85%', target: '98%', current: '97%' },
        falsePositives: { baseline: '15%', target: '3%', current: '4%' },
        lossesAvoided: { baseline: '$0', target: '$3M', current: '$2.8M' }
      }
    }
  ]);

  const [activeFormTab, setActiveFormTab] = useState(0);
  const [formData, setFormData] = useState({
    // 1. Use Case Overview
    name: '',
    owner: '',
    status: 'Discovery',
    executiveSummary: '',
    
    // 2. Business Context
    currentState: '',
    manualProcesses: '',
    currentCosts: '',
    desiredState: '',
    operationsChange: '',
    businessObjective: 'Revenue Growth',
    strategyAlignment: '',
    primaryBenefits: [],
    quantitativeImpact: '',
    qualitativeImpact: '',
    
    // 3. Success Criteria & KPIs
    kpiMetrics: [],
    mustHaveCriteria: ['', '', ''],
    shouldHaveCriteria: ['', '', ''],
    minAccuracy: '',
    maxErrorRate: '',
    responseTime: '',
    availability: '',
    
    // 4. AI/ML Solution Design
    aiType: 'Generative AI',
    modelTypes: '',
    architecture: '',
    pretrainedModels: '',
    automationLevel: 'Fully automated',
    dataIngestion: '',
    modelAgent: '',
    integrationPoints: '',
    userInterface: '',
    orchestration: '',
    cloudPlatform: '',
    mlServices: '',
    frameworks: '',
    integrationTools: '',
    
    // 5. Data Foundations
    dataRequirements: [],
    completeness: '',
    accuracy: '',
    consistency: '',
    timeliness: '',
    validity: '',
    dataGaps: [],
    dataTransformations: '',
    featureEngineering: '',
    dataEnrichment: '',
    labelingRequirements: '',
    storageLocation: '',
    accessPatterns: '',
    retentionRequirements: '',
    backupRecovery: '',
    
    // 6. Data Governance & Compliance
    dataOwner: '',
    dataSteward: '',
    smes: '',
    sensitivityLevel: 'Internal',
    personalData: 'No',
    regulations: [],
    sourceSystems: '',
    transformationPipeline: '',
    consumptionPoints: '',
    piiHandling: '',
    anonymization: '',
    consentRequirements: '',
    rightToExplanation: '',
    accessControls: '',
    encryption: '',
    auditLogging: 'Enabled',
    dataRetention: '',
    applicableRegulations: '',
    complianceRequirements: '',
    auditTrail: '',
    riskAssessment: [],
    
    // 7. AI Governance & Ethics
    biasAssessment: 'No',
    protectedAttributes: '',
    fairnessMetrics: '',
    explainabilityApproach: '',
    communicationStrategy: '',
    documentationCompleteness: '',
    decisionAuthority: '',
    escalationProcess: '',
    humanOverride: 'Yes',
    developmentApproach: '',
    testingStrategy: '',
    deploymentProcess: '',
    monitoringPlan: '',
    retrainingFrequency: '',
    modelCard: 'No',
    benchmarksDocumented: 'No',
    limitationsDocumented: 'No',
    
    // 8. Implementation Plan
    stakeholders: [],
    timeline: [],
    technicalDependencies: ['', ''],
    businessDependencies: ['', ''],
    teamSize: '',
    budget: '',
    infrastructure: '',
    
    // 9. Operations & Monitoring
    supportModel: '',
    onCallRequirements: '',
    slaCommitments: '',
    metricsMonitored: '',
    alertThresholds: '',
    dashboardLocation: '',
    incidentResponse: '',
    driftDetection: 'Enabled',
    degradationAlerts: '',
    retrainingTriggers: '',
    feedbackCollection: '',
    improvementProcess: '',
    enhancementPipeline: '',
    
    // 10. Financial Analysis
    personnelCost: '',
    infrastructureCost: '',
    toolsLicenses: '',
    trainingDataCost: '',
    computeCost: '',
    storageCost: '',
    maintenanceCost: '',
    supportCost: '',
    investment: '',
    expectedBenefit: '',
    paybackPeriod: '',
    npv: '',
    
    // 11. Change Management
    primaryUsers: '',
    secondaryUsers: '',
    userCount: '',
    trainingMaterials: '',
    trainingDelivery: '',
    certification: '',
    keyMessages: ['', '', ''],
    launchAnnouncement: '',
    ongoingUpdates: '',
    feedbackMechanism: '',
    
    // 12. Lessons Learned
    whatWorked: '',
    challenges: '',
    recommendations: '',
    additionalNotes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUseCase = {
      id: `UC-${String(useCases.length + 1).padStart(3, '0')}`,
      name: formData.name,
      status: formData.status,
      owner: formData.owner,
      dateCreated: new Date().toISOString().split('T')[0],
      aiType: formData.aiType,
      roi: 'TBD',
      businessObjective: formData.businessObjective,
      kpis: {}
    };
    
    setUseCases(prev => [...prev, newUseCase]);
    setShowForm(false);
    setFormData({
      name: '',
      owner: '',
      status: 'Discovery',
      aiType: 'Generative AI',
      businessObjective: 'Revenue Growth',
      executiveSummary: '',
      currentState: '',
      desiredState: '',
      estimatedImpact: '',
      kpiMetrics: []
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Discovery': '#687078',
      'Planning': '#0073BB',
      'Development': '#FF9900',
      'Pilot': '#1D8102',
      'Production': '#1D8102',
      'Retired': '#D13212'
    };
    return colors[status] || '#687078';
  };

  const stats = {
    total: useCases.length,
    production: useCases.filter(uc => uc.status === 'Production').length,
    pilot: useCases.filter(uc => uc.status === 'Pilot').length,
    development: useCases.filter(uc => uc.status === 'Development').length
  };

  return (
    <div className="use-case-registry">
      <div className="registry-header">
        <div className="header-content">
          <h2>AI Use Case Registry</h2>
          <p>Comprehensive catalog of all AI initiatives across the organization</p>
        </div>
        <button className="btn-add-use-case" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Use Case'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="registry-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Use Cases</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-value">{stats.production}</div>
            <div className="stat-label">In Production</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧪</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pilot}</div>
            <div className="stat-label">In Pilot</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.development}</div>
            <div className="stat-label">In Development</div>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="use-case-form-container">
          <form className="use-case-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>New Use Case Documentation</h3>
              <p>Complete all sections to create a comprehensive use case record</p>
            </div>

            {/* Form Tabs */}
            <div className="form-tabs">
              <button
                type="button"
                className={`form-tab ${activeFormTab === 0 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(0)}
              >
                1. Overview
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(1)}
              >
                2. Business Context
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 2 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(2)}
              >
                3. Success & KPIs
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 3 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(3)}
              >
                4. AI Solution
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 4 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(4)}
              >
                5. Data
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 5 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(5)}
              >
                6. Governance
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 6 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(6)}
              >
                7. Ethics
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 7 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(7)}
              >
                8. Implementation
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 8 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(8)}
              >
                9. Operations
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 9 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(9)}
              >
                10. Financial
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 10 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(10)}
              >
                11. Change Mgmt
              </button>
              <button
                type="button"
                className={`form-tab ${activeFormTab === 11 ? 'active' : ''}`}
                onClick={() => setActiveFormTab(11)}
              >
                12. Lessons
              </button>
            </div>

            {/* Tab Content */}
            <div className="form-tab-content">
              
              {/* Tab 0: Use Case Overview */}
              {activeFormTab === 0 && (
                <div className="form-section">
                  <h4>1. Use Case Overview</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Use Case Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Customer Service Chatbot"
                      />
                    </div>
                    <div className="form-group">
                      <label>Owner/Sponsor *</label>
                      <input
                        type="text"
                        name="owner"
                        value={formData.owner}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., John Smith"
                      />
                    </div>
                    <div className="form-group">
                      <label>Status *</label>
                      <select name="status" value={formData.status} onChange={handleInputChange}>
                        <option value="Discovery">Discovery</option>
                        <option value="Planning">Planning</option>
                        <option value="Development">Development</option>
                        <option value="Pilot">Pilot</option>
                        <option value="Production">Production</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Executive Summary *</label>
                    <textarea
                      name="executiveSummary"
                      value={formData.executiveSummary}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      placeholder="Brief 2-3 sentence description of the use case"
                    />
                  </div>
                </div>
              )}

              {/* Tab 1: Business Context */}
              {activeFormTab === 1 && (
                <div className="form-section">
                  <h4>2. Business Context</h4>
                  
                  <h5>2.1 Business Pain Point / Opportunity</h5>
                  <div className="form-group">
                    <label>Current State - Problem/Inefficiency</label>
                    <textarea
                      name="currentState"
                      value={formData.currentState}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="What is the existing problem or inefficiency?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Manual Processes Today</label>
                    <textarea
                      name="manualProcesses"
                      value={formData.manualProcesses}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="What manual processes exist today?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Current Costs/Impacts</label>
                    <textarea
                      name="currentCosts"
                      value={formData.currentCosts}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="What are the current costs/impacts?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Desired Future State</label>
                    <textarea
                      name="desiredState"
                      value={formData.desiredState}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="What will success look like?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>How Operations Will Change</label>
                    <textarea
                      name="operationsChange"
                      value={formData.operationsChange}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="How will operations change?"
                    />
                  </div>
                  
                  <h5>Strategic Alignment</h5>
                  <div className="form-group">
                    <label>Business Objective *</label>
                    <select name="businessObjective" value={formData.businessObjective} onChange={handleInputChange}>
                      <option value="Revenue Growth">Revenue Growth</option>
                      <option value="Customer Experience">Customer Experience</option>
                      <option value="Operational Efficiency">Operational Efficiency</option>
                      <option value="Risk Reduction">Risk Reduction</option>
                      <option value="Innovation">Innovation</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>AI Strategy Alignment</label>
                    <textarea
                      name="strategyAlignment"
                      value={formData.strategyAlignment}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="How does this align with organizational AI strategy?"
                    />
                  </div>
                  
                  <h5>2.2 Business Value Proposition</h5>
                  <div className="form-group">
                    <label>Primary Benefits (check all that apply)</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" value="cost-savings" /> Cost savings/avoidance
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="revenue" /> Revenue generation/protection
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="time" /> Time savings
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="quality" /> Quality improvements
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="risk" /> Risk mitigation
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Quantitative Impact</label>
                      <textarea
                        name="quantitativeImpact"
                        value={formData.quantitativeImpact}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Financial, time, volume impacts"
                      />
                    </div>
                    <div className="form-group">
                      <label>Qualitative Impact</label>
                      <textarea
                        name="qualitativeImpact"
                        value={formData.qualitativeImpact}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Customer satisfaction, employee experience"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Success Criteria & KPIs */}
              {activeFormTab === 2 && (
                <div className="form-section">
                  <h4>3. Success Criteria & KPIs</h4>
                  
                  <h5>3.1 Key Performance Indicators</h5>
                  <p className="form-note">Define KPIs that will be tracked in the dashboard sections</p>
                  
                  <div className="kpi-table">
                    <table className="form-table">
                      <thead>
                        <tr>
                          <th>KPI Category</th>
                          <th>Metric Name</th>
                          <th>Baseline</th>
                          <th>Target</th>
                          <th>Measurement Frequency</th>
                          <th>Data Source</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="kpi-category-cell">Business Impact</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Revenue Growth"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., $5M"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., $8M"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Financial system"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="kpi-category-cell">Operational Efficiency</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Process Cycle Time"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 24 hours"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 4 hours"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Operations DB"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="kpi-category-cell">Model Performance</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Accuracy"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., N/A"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 95%"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., ML Platform"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="kpi-category-cell">User Adoption</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Active Users"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 0"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 500"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Analytics"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="kpi-category-cell">Cost Metrics</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Cost per Transaction"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., $5.00"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., $2.00"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Quarterly">Quarterly</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Cost tracking"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button type="button" className="btn-add-row">
                      + Add KPI
                    </button>
                  </div>
                  
                  <h5>3.2 Success Criteria</h5>
                  <div className="form-group">
                    <label>Must-Have (Launch Criteria)</label>
                    {[0, 1, 2].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={formData.mustHaveCriteria[i]}
                        onChange={(e) => {
                          const newCriteria = [...formData.mustHaveCriteria];
                          newCriteria[i] = e.target.value;
                          setFormData(prev => ({ ...prev, mustHaveCriteria: newCriteria }));
                        }}
                        placeholder={`Must-have criterion ${i + 1}`}
                        style={{ marginBottom: '8px' }}
                      />
                    ))}
                  </div>
                  
                  <div className="form-group">
                    <label>Should-Have (Post-Launch Optimization)</label>
                    {[0, 1, 2].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={formData.shouldHaveCriteria[i]}
                        onChange={(e) => {
                          const newCriteria = [...formData.shouldHaveCriteria];
                          newCriteria[i] = e.target.value;
                          setFormData(prev => ({ ...prev, shouldHaveCriteria: newCriteria }));
                        }}
                        placeholder={`Should-have criterion ${i + 1}`}
                        style={{ marginBottom: '8px' }}
                      />
                    ))}
                  </div>
                  
                  <h5>Acceptance Thresholds</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Minimum Accuracy/Performance Level (%)</label>
                      <input
                        type="text"
                        name="minAccuracy"
                        value={formData.minAccuracy}
                        onChange={handleInputChange}
                        placeholder="e.g., 95%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Maximum Acceptable Error Rate (%)</label>
                      <input
                        type="text"
                        name="maxErrorRate"
                        value={formData.maxErrorRate}
                        onChange={handleInputChange}
                        placeholder="e.g., 5%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Response Time Requirements (ms)</label>
                      <input
                        type="text"
                        name="responseTime"
                        value={formData.responseTime}
                        onChange={handleInputChange}
                        placeholder="e.g., 500ms"
                      />
                    </div>
                    <div className="form-group">
                      <label>Availability Requirements (%)</label>
                      <input
                        type="text"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        placeholder="e.g., 99.9%"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: AI/ML Solution Design */}
              {activeFormTab === 3 && (
                <div className="form-section">
                  <h4>4. AI/ML Solution Design</h4>
                  
                  <h5>4.1 AI Approach</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Type of AI *</label>
                      <select name="aiType" value={formData.aiType} onChange={handleInputChange}>
                        <option value="Generative AI">Generative AI</option>
                        <option value="Predictive ML">Predictive ML</option>
                        <option value="Agentic AI">Agentic AI</option>
                        <option value="Computer Vision">Computer Vision</option>
                        <option value="NLP">NLP</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Automation Level</label>
                      <select name="automationLevel" value={formData.automationLevel} onChange={handleInputChange}>
                        <option value="Fully automated">Fully automated</option>
                        <option value="Human-in-the-loop">Human-in-the-loop</option>
                        <option value="AI-assisted">AI-assisted (human decision)</option>
                        <option value="Advisory only">Advisory only</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Model Type(s)</label>
                      <input
                        type="text"
                        name="modelTypes"
                        value={formData.modelTypes}
                        onChange={handleInputChange}
                        placeholder="e.g., Transformer, CNN, LSTM"
                      />
                    </div>
                    <div className="form-group">
                      <label>Architecture Approach</label>
                      <input
                        type="text"
                        name="architecture"
                        value={formData.architecture}
                        onChange={handleInputChange}
                        placeholder="e.g., Microservices, Serverless"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Pre-trained Models/Foundation Models</label>
                    <input
                      type="text"
                      name="pretrainedModels"
                      value={formData.pretrainedModels}
                      onChange={handleInputChange}
                      placeholder="e.g., Claude, GPT-4, BERT"
                    />
                  </div>
                  
                  <h5>4.2 Solution Components</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Data Ingestion</label>
                      <input
                        type="text"
                        name="dataIngestion"
                        value={formData.dataIngestion}
                        onChange={handleInputChange}
                        placeholder="Data ingestion approach"
                      />
                    </div>
                    <div className="form-group">
                      <label>Model/Agent</label>
                      <input
                        type="text"
                        name="modelAgent"
                        value={formData.modelAgent}
                        onChange={handleInputChange}
                        placeholder="Model or agent details"
                      />
                    </div>
                    <div className="form-group">
                      <label>Integration Points</label>
                      <input
                        type="text"
                        name="integrationPoints"
                        value={formData.integrationPoints}
                        onChange={handleInputChange}
                        placeholder="System integration points"
                      />
                    </div>
                    <div className="form-group">
                      <label>User Interface</label>
                      <input
                        type="text"
                        name="userInterface"
                        value={formData.userInterface}
                        onChange={handleInputChange}
                        placeholder="UI/UX approach"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Orchestration (if agentic)</label>
                    <input
                      type="text"
                      name="orchestration"
                      value={formData.orchestration}
                      onChange={handleInputChange}
                      placeholder="e.g., Strands, LangGraph"
                    />
                  </div>
                  
                  <h5>Technology Stack</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Cloud Platform</label>
                      <input
                        type="text"
                        name="cloudPlatform"
                        value={formData.cloudPlatform}
                        onChange={handleInputChange}
                        placeholder="e.g., AWS, Azure, GCP"
                      />
                    </div>
                    <div className="form-group">
                      <label>ML/AI Services</label>
                      <input
                        type="text"
                        name="mlServices"
                        value={formData.mlServices}
                        onChange={handleInputChange}
                        placeholder="e.g., Bedrock, SageMaker"
                      />
                    </div>
                    <div className="form-group">
                      <label>Development Frameworks</label>
                      <input
                        type="text"
                        name="frameworks"
                        value={formData.frameworks}
                        onChange={handleInputChange}
                        placeholder="e.g., PyTorch, TensorFlow"
                      />
                    </div>
                    <div className="form-group">
                      <label>Integration Tools</label>
                      <input
                        type="text"
                        name="integrationTools"
                        value={formData.integrationTools}
                        onChange={handleInputChange}
                        placeholder="e.g., API Gateway, EventBridge"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Data Foundations */}
              {activeFormTab === 4 && (
                <div className="form-section">
                  <h4>5. Data Foundations</h4>
                  
                  <h5>5.1 Data Requirements</h5>
                  <div className="data-requirements-table">
                    <table className="form-table">
                      <thead>
                        <tr>
                          <th>Data Type</th>
                          <th>Source System</th>
                          <th>Volume</th>
                          <th>Frequency</th>
                          <th>Quality Level</th>
                          <th>Availability</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Customer data"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., CRM"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 10M records"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Hourly">Hourly</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="On-demand">On-demand</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High (&gt;95%)</option>
                              <option value="Medium">Medium (80-95%)</option>
                              <option value="Low">Low (&lt;80%)</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Available">Available</option>
                              <option value="Partial">Partial</option>
                              <option value="Not Available">Not Available</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Transaction data"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Payment system"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 1M/day"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Hourly">Hourly</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="On-demand">On-demand</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High (&gt;95%)</option>
                              <option value="Medium">Medium (80-95%)</option>
                              <option value="Low">Low (&lt;80%)</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Available">Available</option>
                              <option value="Partial">Partial</option>
                              <option value="Not Available">Not Available</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Historical logs"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Data warehouse"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 5TB"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Real-time">Real-time</option>
                              <option value="Hourly">Hourly</option>
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="On-demand">On-demand</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High (&gt;95%)</option>
                              <option value="Medium">Medium (80-95%)</option>
                              <option value="Low">Low (&lt;80%)</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Available">Available</option>
                              <option value="Partial">Partial</option>
                              <option value="Not Available">Not Available</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button type="button" className="btn-add-row">
                      + Add Data Source
                    </button>
                  </div>
                  
                  <h5>5.2 Data Quality Assessment</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Completeness (%)</label>
                      <input
                        type="text"
                        name="completeness"
                        value={formData.completeness}
                        onChange={handleInputChange}
                        placeholder="e.g., 95%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Accuracy (%)</label>
                      <input
                        type="text"
                        name="accuracy"
                        value={formData.accuracy}
                        onChange={handleInputChange}
                        placeholder="e.g., 98%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Consistency (%)</label>
                      <input
                        type="text"
                        name="consistency"
                        value={formData.consistency}
                        onChange={handleInputChange}
                        placeholder="e.g., 99%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Timeliness (%)</label>
                      <input
                        type="text"
                        name="timeliness"
                        value={formData.timeliness}
                        onChange={handleInputChange}
                        placeholder="e.g., 97%"
                      />
                    </div>
                    <div className="form-group">
                      <label>Validity (%)</label>
                      <input
                        type="text"
                        name="validity"
                        value={formData.validity}
                        onChange={handleInputChange}
                        placeholder="e.g., 100%"
                      />
                    </div>
                  </div>
                  
                  <h5>5.3 Data Preparation</h5>
                  <div className="form-group">
                    <label>Data Transformations</label>
                    <textarea
                      name="dataTransformations"
                      value={formData.dataTransformations}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Data cleaning steps"
                    />
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Feature Engineering</label>
                      <textarea
                        name="featureEngineering"
                        value={formData.featureEngineering}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Feature engineering approach"
                      />
                    </div>
                    <div className="form-group">
                      <label>Data Enrichment</label>
                      <textarea
                        name="dataEnrichment"
                        value={formData.dataEnrichment}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Data enrichment strategy"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Labeling Requirements</label>
                    <textarea
                      name="labelingRequirements"
                      value={formData.labelingRequirements}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Data labeling needs"
                    />
                  </div>
                  
                  <h5>Data Storage & Access</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Storage Location</label>
                      <input
                        type="text"
                        name="storageLocation"
                        value={formData.storageLocation}
                        onChange={handleInputChange}
                        placeholder="e.g., S3, Redshift"
                      />
                    </div>
                    <div className="form-group">
                      <label>Access Patterns</label>
                      <input
                        type="text"
                        name="accessPatterns"
                        value={formData.accessPatterns}
                        onChange={handleInputChange}
                        placeholder="e.g., Real-time, Batch"
                      />
                    </div>
                    <div className="form-group">
                      <label>Retention Requirements</label>
                      <input
                        type="text"
                        name="retentionRequirements"
                        value={formData.retentionRequirements}
                        onChange={handleInputChange}
                        placeholder="e.g., 7 years"
                      />
                    </div>
                    <div className="form-group">
                      <label>Backup/Recovery</label>
                      <input
                        type="text"
                        name="backupRecovery"
                        value={formData.backupRecovery}
                        onChange={handleInputChange}
                        placeholder="Backup strategy"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs 5-11 will continue in next message due to length */}
              
              {/* Tab 5: Data Governance & Compliance */}
              {activeFormTab === 5 && (
                <div className="form-section">
                  <h4>6. Data Governance & Compliance</h4>
                  
                  <h5>6.1 Data Governance</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Data Owner</label>
                      <input
                        type="text"
                        name="dataOwner"
                        value={formData.dataOwner}
                        onChange={handleInputChange}
                        placeholder="Data owner name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Data Steward</label>
                      <input
                        type="text"
                        name="dataSteward"
                        value={formData.dataSteward}
                        onChange={handleInputChange}
                        placeholder="Data steward name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Subject Matter Experts</label>
                      <input
                        type="text"
                        name="smes"
                        value={formData.smes}
                        onChange={handleInputChange}
                        placeholder="SME names"
                      />
                    </div>
                  </div>
                  
                  <h5>Data Classification</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Sensitivity Level</label>
                      <select name="sensitivityLevel" value={formData.sensitivityLevel} onChange={handleInputChange}>
                        <option value="Public">Public</option>
                        <option value="Internal">Internal</option>
                        <option value="Confidential">Confidential</option>
                        <option value="Restricted">Restricted</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Personal Data Included</label>
                      <select name="personalData" value={formData.personalData} onChange={handleInputChange}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Regulatory Requirements (check all that apply)</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" value="GDPR" /> GDPR
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="CCPA" /> CCPA
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="HIPAA" /> HIPAA
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="SOX" /> SOX
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" value="Other" /> Other
                      </label>
                    </div>
                  </div>
                  
                  <h5>6.2 Privacy & Security</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>PII/Sensitive Data Handling</label>
                      <textarea
                        name="piiHandling"
                        value={formData.piiHandling}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="How PII will be handled"
                      />
                    </div>
                    <div className="form-group">
                      <label>Anonymization/Pseudonymization</label>
                      <textarea
                        name="anonymization"
                        value={formData.anonymization}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Anonymization approach"
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Access Controls</label>
                      <input
                        type="text"
                        name="accessControls"
                        value={formData.accessControls}
                        onChange={handleInputChange}
                        placeholder="e.g., RBAC, ABAC"
                      />
                    </div>
                    <div className="form-group">
                      <label>Encryption Requirements</label>
                      <input
                        type="text"
                        name="encryption"
                        value={formData.encryption}
                        onChange={handleInputChange}
                        placeholder="Encryption approach"
                      />
                    </div>
                    <div className="form-group">
                      <label>Audit Logging</label>
                      <select name="auditLogging" value={formData.auditLogging} onChange={handleInputChange}>
                        <option value="Enabled">Enabled</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                  
                  <h5>6.3 Risk Assessment</h5>
                  <div className="risk-assessment-table">
                    <table className="form-table">
                      <thead>
                        <tr>
                          <th>Risk Category</th>
                          <th>Description</th>
                          <th>Likelihood</th>
                          <th>Impact</th>
                          <th>Mitigation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="risk-category">Model bias</td>
                          <td>
                            <input
                              type="text"
                              placeholder="Describe the risk"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Mitigation strategy"
                              className="table-input"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="risk-category">Data privacy</td>
                          <td>
                            <input
                              type="text"
                              placeholder="Describe the risk"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Mitigation strategy"
                              className="table-input"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="risk-category">Security</td>
                          <td>
                            <input
                              type="text"
                              placeholder="Describe the risk"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Mitigation strategy"
                              className="table-input"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="risk-category">Operational</td>
                          <td>
                            <input
                              type="text"
                              placeholder="Describe the risk"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Mitigation strategy"
                              className="table-input"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: AI Governance & Ethics */}
              {activeFormTab === 6 && (
                <div className="form-section">
                  <h4>7. AI Governance & Ethics</h4>
                  
                  <h5>7.1 Responsible AI Principles</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Bias Assessment Completed</label>
                      <select name="biasAssessment" value={formData.biasAssessment} onChange={handleInputChange}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Human Override Capability</label>
                      <select name="humanOverride" value={formData.humanOverride} onChange={handleInputChange}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Protected Attributes Considered</label>
                      <input
                        type="text"
                        name="protectedAttributes"
                        value={formData.protectedAttributes}
                        onChange={handleInputChange}
                        placeholder="e.g., race, gender, age"
                      />
                    </div>
                    <div className="form-group">
                      <label>Fairness Metrics</label>
                      <input
                        type="text"
                        name="fairnessMetrics"
                        value={formData.fairnessMetrics}
                        onChange={handleInputChange}
                        placeholder="Fairness measurement approach"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Model Explainability Approach</label>
                    <textarea
                      name="explainabilityApproach"
                      value={formData.explainabilityApproach}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="How model decisions will be explained"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>User Communication Strategy</label>
                    <textarea
                      name="communicationStrategy"
                      value={formData.communicationStrategy}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="How AI usage will be communicated to users"
                    />
                  </div>
                  
                  <h5>7.2 Model Governance</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Model Card Completed</label>
                      <select name="modelCard" value={formData.modelCard} onChange={handleInputChange}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Benchmarks Documented</label>
                      <select name="benchmarksDocumented" value={formData.benchmarksDocumented} onChange={handleInputChange}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Limitations Documented</label>
                      <select name="limitationsDocumented" value={formData.limitationsDocumented} onChange={handleInputChange}>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Retraining Frequency</label>
                    <input
                      type="text"
                      name="retrainingFrequency"
                      value={formData.retrainingFrequency}
                      onChange={handleInputChange}
                      placeholder="e.g., Monthly, Quarterly"
                    />
                  </div>
                </div>
              )}

              {/* Tab 7: Implementation Plan */}
              {activeFormTab === 7 && (
                <div className="form-section">
                  <h4>8. Implementation Plan</h4>
                  
                  <h5>8.1 Stakeholders</h5>
                  <div className="stakeholders-table">
                    <table className="form-table">
                      <thead>
                        <tr>
                          <th>Role</th>
                          <th>Name</th>
                          <th>Responsibility</th>
                          <th>Engagement Level</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="role-cell">Executive Sponsor</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Jane Smith"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Strategic oversight, budget approval"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="role-cell">Product Owner</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., John Doe"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Requirements definition, prioritization"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="role-cell">Technical Lead</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Sarah Johnson"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Architecture design, technical decisions"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="role-cell">Data Engineer</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Michael Chen"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Data pipeline development, ETL"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="role-cell">ML Engineer</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Emily Rodriguez"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Model development, training, optimization"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="role-cell">Business SME</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., David Lee"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Domain expertise, validation"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                              <option value="As Needed">As Needed</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button type="button" className="btn-add-row">
                      + Add Stakeholder
                    </button>
                  </div>
                  
                  <h5>8.2 Timeline & Milestones</h5>
                  <div className="timeline-table">
                    <table className="form-table">
                      <thead>
                        <tr>
                          <th>Phase</th>
                          <th>Key Activities</th>
                          <th>Duration</th>
                          <th>Target Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="phase-cell">Discovery</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Requirements gathering, feasibility study"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 4 weeks"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="phase-cell">Design</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Architecture design, data modeling"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 6 weeks"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="phase-cell">Development</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Model training, integration development"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 12 weeks"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="phase-cell">Testing</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Unit testing, UAT, performance testing"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 4 weeks"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="phase-cell">Pilot</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Limited production deployment, monitoring"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 8 weeks"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="phase-cell">Production</td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., Full deployment, handover to operations"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="e.g., 2 weeks"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="table-input"
                            />
                          </td>
                          <td>
                            <select className="table-select">
                              <option value="">Select</option>
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </td>
                          <td>
                            <button type="button" className="btn-table-remove" title="Remove row">
                              ✕
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button type="button" className="btn-add-row">
                      + Add Phase
                    </button>
                  </div>
                  
                  <h5>8.3 Dependencies & Prerequisites</h5>
                  <div className="form-group">
                    <label>Technical Dependencies</label>
                    {[0, 1].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={formData.technicalDependencies[i]}
                        onChange={(e) => {
                          const newDeps = [...formData.technicalDependencies];
                          newDeps[i] = e.target.value;
                          setFormData(prev => ({ ...prev, technicalDependencies: newDeps }));
                        }}
                        placeholder={`Technical dependency ${i + 1}`}
                        style={{ marginBottom: '8px' }}
                      />
                    ))}
                  </div>
                  
                  <div className="form-group">
                    <label>Business Dependencies</label>
                    {[0, 1].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={formData.businessDependencies[i]}
                        onChange={(e) => {
                          const newDeps = [...formData.businessDependencies];
                          newDeps[i] = e.target.value;
                          setFormData(prev => ({ ...prev, businessDependencies: newDeps }));
                        }}
                        placeholder={`Business dependency ${i + 1}`}
                        style={{ marginBottom: '8px' }}
                      />
                    ))}
                  </div>
                  
                  <h5>Resource Requirements</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Team Size</label>
                      <input
                        type="text"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        placeholder="e.g., 5 FTE"
                      />
                    </div>
                    <div className="form-group">
                      <label>Budget</label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="e.g., $500K"
                      />
                    </div>
                    <div className="form-group">
                      <label>Infrastructure</label>
                      <input
                        type="text"
                        name="infrastructure"
                        value={formData.infrastructure}
                        onChange={handleInputChange}
                        placeholder="Infrastructure needs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 8: Operations & Monitoring */}
              {activeFormTab === 8 && (
                <div className="form-section">
                  <h4>9. Operations & Monitoring</h4>
                  
                  <h5>9.1 Operational Model</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Support Model</label>
                      <input
                        type="text"
                        name="supportModel"
                        value={formData.supportModel}
                        onChange={handleInputChange}
                        placeholder="L1/L2/L3 structure"
                      />
                    </div>
                    <div className="form-group">
                      <label>On-Call Requirements</label>
                      <input
                        type="text"
                        name="onCallRequirements"
                        value={formData.onCallRequirements}
                        onChange={handleInputChange}
                        placeholder="On-call rotation"
                      />
                    </div>
                    <div className="form-group">
                      <label>SLA Commitments</label>
                      <input
                        type="text"
                        name="slaCommitments"
                        value={formData.slaCommitments}
                        onChange={handleInputChange}
                        placeholder="e.g., 99.9% uptime"
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Metrics Monitored</label>
                      <textarea
                        name="metricsMonitored"
                        value={formData.metricsMonitored}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Performance metrics to monitor"
                      />
                    </div>
                    <div className="form-group">
                      <label>Alert Thresholds</label>
                      <textarea
                        name="alertThresholds"
                        value={formData.alertThresholds}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Alert threshold values"
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Dashboard Location</label>
                      <input
                        type="text"
                        name="dashboardLocation"
                        value={formData.dashboardLocation}
                        onChange={handleInputChange}
                        placeholder="e.g., Grafana, CloudWatch"
                      />
                    </div>
                    <div className="form-group">
                      <label>Drift Detection</label>
                      <select name="driftDetection" value={formData.driftDetection} onChange={handleInputChange}>
                        <option value="Enabled">Enabled</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                  
                  <h5>9.2 Continuous Improvement</h5>
                  <div className="form-group">
                    <label>Feedback Collection Method</label>
                    <textarea
                      name="feedbackCollection"
                      value={formData.feedbackCollection}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="How user feedback will be collected"
                    />
                  </div>
                </div>
              )}

              {/* Tab 9: Financial Analysis */}
              {activeFormTab === 9 && (
                <div className="form-section">
                  <h4>10. Financial Analysis</h4>
                  
                  <h5>10.1 Cost Structure</h5>
                  <h6>Development Costs</h6>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Personnel ($)</label>
                      <input
                        type="text"
                        name="personnelCost"
                        value={formData.personnelCost}
                        onChange={handleInputChange}
                        placeholder="e.g., 250000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Infrastructure ($)</label>
                      <input
                        type="text"
                        name="infrastructureCost"
                        value={formData.infrastructureCost}
                        onChange={handleInputChange}
                        placeholder="e.g., 50000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tools/Licenses ($)</label>
                      <input
                        type="text"
                        name="toolsLicenses"
                        value={formData.toolsLicenses}
                        onChange={handleInputChange}
                        placeholder="e.g., 25000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Training Data ($)</label>
                      <input
                        type="text"
                        name="trainingDataCost"
                        value={formData.trainingDataCost}
                        onChange={handleInputChange}
                        placeholder="e.g., 15000"
                      />
                    </div>
                  </div>
                  
                  <h6>Ongoing Costs (Annual)</h6>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Compute/Inference ($)</label>
                      <input
                        type="text"
                        name="computeCost"
                        value={formData.computeCost}
                        onChange={handleInputChange}
                        placeholder="e.g., 120000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Storage ($)</label>
                      <input
                        type="text"
                        name="storageCost"
                        value={formData.storageCost}
                        onChange={handleInputChange}
                        placeholder="e.g., 20000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Maintenance ($)</label>
                      <input
                        type="text"
                        name="maintenanceCost"
                        value={formData.maintenanceCost}
                        onChange={handleInputChange}
                        placeholder="e.g., 50000"
                      />
                    </div>
                    <div className="form-group">
                      <label>Support ($)</label>
                      <input
                        type="text"
                        name="supportCost"
                        value={formData.supportCost}
                        onChange={handleInputChange}
                        placeholder="e.g., 30000"
                      />
                    </div>
                  </div>
                  
                  <h5>10.2 ROI Analysis</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Total Investment ($)</label>
                      <input
                        type="text"
                        name="investment"
                        value={formData.investment}
                        onChange={handleInputChange}
                        placeholder="Total investment"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expected Annual Benefit ($)</label>
                      <input
                        type="text"
                        name="expectedBenefit"
                        value={formData.expectedBenefit}
                        onChange={handleInputChange}
                        placeholder="Annual benefit"
                      />
                    </div>
                    <div className="form-group">
                      <label>Payback Period (months)</label>
                      <input
                        type="text"
                        name="paybackPeriod"
                        value={formData.paybackPeriod}
                        onChange={handleInputChange}
                        placeholder="e.g., 18"
                      />
                    </div>
                    <div className="form-group">
                      <label>3-Year NPV ($)</label>
                      <input
                        type="text"
                        name="npv"
                        value={formData.npv}
                        onChange={handleInputChange}
                        placeholder="Net present value"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 10: Change Management */}
              {activeFormTab === 10 && (
                <div className="form-section">
                  <h4>11. Change Management</h4>
                  
                  <h5>11.1 User Adoption</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Primary Users</label>
                      <input
                        type="text"
                        name="primaryUsers"
                        value={formData.primaryUsers}
                        onChange={handleInputChange}
                        placeholder="Primary user groups"
                      />
                    </div>
                    <div className="form-group">
                      <label>Secondary Users</label>
                      <input
                        type="text"
                        name="secondaryUsers"
                        value={formData.secondaryUsers}
                        onChange={handleInputChange}
                        placeholder="Secondary user groups"
                      />
                    </div>
                    <div className="form-group">
                      <label>User Count</label>
                      <input
                        type="text"
                        name="userCount"
                        value={formData.userCount}
                        onChange={handleInputChange}
                        placeholder="e.g., 500"
                      />
                    </div>
                  </div>
                  
                  <h5>Training Requirements</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Training Materials Needed</label>
                      <textarea
                        name="trainingMaterials"
                        value={formData.trainingMaterials}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Types of training materials"
                      />
                    </div>
                    <div className="form-group">
                      <label>Training Delivery Method</label>
                      <input
                        type="text"
                        name="trainingDelivery"
                        value={formData.trainingDelivery}
                        onChange={handleInputChange}
                        placeholder="e.g., Online, In-person"
                      />
                    </div>
                    <div className="form-group">
                      <label>Certification Requirements</label>
                      <input
                        type="text"
                        name="certification"
                        value={formData.certification}
                        onChange={handleInputChange}
                        placeholder="Certification needs"
                      />
                    </div>
                  </div>
                  
                  <h5>11.2 Communication Plan</h5>
                  <div className="form-group">
                    <label>Key Messages</label>
                    {[0, 1, 2].map(i => (
                      <input
                        key={i}
                        type="text"
                        value={formData.keyMessages[i]}
                        onChange={(e) => {
                          const newMessages = [...formData.keyMessages];
                          newMessages[i] = e.target.value;
                          setFormData(prev => ({ ...prev, keyMessages: newMessages }));
                        }}
                        placeholder={`Key message ${i + 1}`}
                        style={{ marginBottom: '8px' }}
                      />
                    ))}
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Launch Announcement</label>
                      <input
                        type="text"
                        name="launchAnnouncement"
                        value={formData.launchAnnouncement}
                        onChange={handleInputChange}
                        placeholder="Launch communication channel"
                      />
                    </div>
                    <div className="form-group">
                      <label>Ongoing Updates</label>
                      <input
                        type="text"
                        name="ongoingUpdates"
                        value={formData.ongoingUpdates}
                        onChange={handleInputChange}
                        placeholder="Update communication method"
                      />
                    </div>
                    <div className="form-group">
                      <label>Feedback Mechanism</label>
                      <input
                        type="text"
                        name="feedbackMechanism"
                        value={formData.feedbackMechanism}
                        onChange={handleInputChange}
                        placeholder="How feedback will be collected"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 11: Lessons Learned */}
              {activeFormTab === 11 && (
                <div className="form-section">
                  <h4>12. Lessons Learned & Notes</h4>
                  
                  <div className="form-group">
                    <label>What Worked Well</label>
                    <textarea
                      name="whatWorked"
                      value={formData.whatWorked}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Successes and positive outcomes"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Challenges Encountered</label>
                    <textarea
                      name="challenges"
                      value={formData.challenges}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Difficulties and obstacles"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Recommendations for Future Use Cases</label>
                    <textarea
                      name="recommendations"
                      value={formData.recommendations}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Lessons learned and recommendations"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Any other relevant information"
                    />
                  </div>
                </div>
              )}
              
            </div>

            <div className="form-navigation">
              <button
                type="button"
                className="btn-prev"
                onClick={() => setActiveFormTab(Math.max(0, activeFormTab - 1))}
                disabled={activeFormTab === 0}
              >
                ← Previous
              </button>
              <span className="form-progress">
                Section {activeFormTab + 1} of 12
              </span>
              {activeFormTab < 11 ? (
                <button
                  type="button"
                  className="btn-next"
                  onClick={() => setActiveFormTab(Math.min(11, activeFormTab + 1))}
                >
                  Next →
                </button>
              ) : (
                <button type="submit" className="btn-submit">
                  Create Use Case
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Use Cases List */}
      <div className="use-cases-list">
        <div className="list-header">
          <h3>All Use Cases ({useCases.length})</h3>
          <div className="list-filters">
            <input type="text" placeholder="Search use cases..." className="search-input" />
            <select className="filter-select">
              <option value="">All Statuses</option>
              <option value="Production">Production</option>
              <option value="Pilot">Pilot</option>
              <option value="Development">Development</option>
              <option value="Planning">Planning</option>
              <option value="Discovery">Discovery</option>
            </select>
          </div>
        </div>

        <div className="use-cases-grid">
          {useCases.map(useCase => (
            <div key={useCase.id} className="use-case-card">
              <div className="card-header">
                <div className="card-title-section">
                  <h4>{useCase.name}</h4>
                  <span className="use-case-id">{useCase.id}</span>
                </div>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(useCase.status) }}
                >
                  {useCase.status}
                </span>
              </div>

              <div className="card-meta">
                <div className="meta-item">
                  <span className="meta-icon">👤</span>
                  <span className="meta-label">Owner:</span>
                  <span className="meta-value">{useCase.owner}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">{useCase.dateCreated}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🤖</span>
                  <span className="meta-label">Type:</span>
                  <span className="meta-value">{useCase.aiType}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🎯</span>
                  <span className="meta-label">Objective:</span>
                  <span className="meta-value">{useCase.businessObjective}</span>
                </div>
              </div>

              <div className="card-kpis">
                <div className="kpi-header">
                  <span>Key Metrics</span>
                  <span className="roi-badge">ROI: {useCase.roi}</span>
                </div>
                <div className="kpi-grid">
                  {Object.entries(useCase.kpis).map(([key, values]) => (
                    <div key={key} className="kpi-item">
                      <div className="kpi-name">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="kpi-values">
                        <span className="kpi-baseline">Baseline: {values.baseline}</span>
                        <span className="kpi-arrow">→</span>
                        <span className="kpi-current">Current: {values.current}</span>
                        <span className="kpi-target">(Target: {values.target})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-view">View Details</button>
                <button className="btn-edit">Edit</button>
                <button className="btn-metrics">View Metrics</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FeedbackButton 
        pageName="Use Case Registry" 
        onFeedbackSubmit={onFeedbackSubmit}
      />
    </div>
  );
};

export default UseCaseRegistry;
