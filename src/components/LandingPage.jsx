import React from 'react';
import { AWS_COLORS } from '../utils/chartConfig';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">AI Success Metrics Framework</div>
          <h1 className="hero-title">
            Measure What Matters.<br />
            Drive AI Success.
          </h1>
          <p className="hero-subtitle">
            A comprehensive framework for tracking, measuring, and optimizing your AI program's 
            business impact across six critical dimensions.
          </p>
          <button className="cta-button" onClick={onEnter}>
            Explore the Dashboard
            <span className="arrow">→</span>
          </button>
        </div>
      </div>

      <div className="landing-content">
        {/* Infographic Section */}
        <section className="section section-infographic">
          <div className="infographic-container">
            <div className="infographic-wrapper">
              <img 
                src="/ai-value-roadmap.jpg" 
                alt="From Hype to ROI: A Leader's AI Value Roadmap - A structured roadmap showing three stages: Strategize & Plan, Build & Scale, and Measure & Govern, with the four categories of AI Value"
                className="infographic-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="infographic-placeholder" style={{ display: 'none' }}>
                <div className="placeholder-content">
                  <h3>📊 AI Value Roadmap Infographic</h3>
                  <p><strong>From Hype to ROI: A Leader's AI Value Roadmap</strong></p>
                  <div className="placeholder-stages">
                    <div className="stage-box">
                      <h4>Stage 1: Strategize & Plan</h4>
                      <ul>
                        <li>Define Clear Business Objectives</li>
                        <li>Ensure Data Quality</li>
                        <li>Target High-Impact Use Cases</li>
                      </ul>
                    </div>
                    <div className="stage-box">
                      <h4>Stage 2: Build & Scale</h4>
                      <ul>
                        <li>Prove Value with MVP</li>
                        <li>Scale Successful Pilots</li>
                        <li>Integrate into Business</li>
                      </ul>
                    </div>
                    <div className="stage-box">
                      <h4>Stage 3: Measure & Govern</h4>
                      <ul>
                        <li>Track Early Signals and Long-Term Impact</li>
                        <li>Govern AI for Sustained Performance</li>
                      </ul>
                    </div>
                  </div>
                  <div className="value-categories">
                    <h4>The Four Categories of AI Value:</h4>
                    <div className="categories-grid">
                      <div className="category">Direct Financial Value</div>
                      <div className="category">Indirect Financial Value</div>
                      <div className="category">Strategic Value</div>
                      <div className="category">Risk & Compliance Value</div>
                    </div>
                  </div>
                  <p className="placeholder-note">
                    <em>To display the full infographic, place the image file at: <code>public/ai-value-roadmap.jpg</code></em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Framework Importance Section */}
        <section className="section section-framework">
          <div className="framework-content">
            <h2 className="framework-title">Why a Robust Measurement Framework is Essential</h2>
            <div className="framework-text">
              <p>
                A robust framework for measuring success is essential because AI value realisation is 
                typically gradual and compounds over time, unlike traditional software which often delivers 
                immediate returns. Measuring impact requires a shift from purely technical metrics, such as 
                model accuracy, to a multi-dimensional approach that includes <strong>"Trending ROI"</strong> (short-term 
                indicators like productivity gains) and <strong>"Realised ROI"</strong> (long-term financial outcomes like 
                revenue growth). Failure to define these indicators can lead to "over-indexing" on model 
                performance, where an algorithm succeeds technically but fails to deliver a commercial impact. 
                Advanced metrics like the <strong>Levelised Cost of AI (LCOAI)</strong> are also emerging to help leaders 
                track the cost per useful output across the entire model lifecycle.
              </p>
              <p>
                Finally, defining success is vital for maintaining governance, data integrity, and executive 
                alignment. Without established baseline data and "before and after" benchmarks, it is impossible 
                to prove the financial impact of an initiative or justify the high ongoing costs of compute and 
                maintenance. Furthermore, rigorous success definitions highlight the importance of data quality; 
                without it, ROI measurements become misleading because it is unclear if disappointing results 
                stem from the AI itself or flawed input data. An integrated approach ensures that AI serves as a 
                strategic engine of transformation with transparent, measurable returns.
              </p>
            </div>
          </div>
        </section>

        {/* Metrics Reporting Section */}
        <section className="section section-metrics-reporting">
          <div className="metrics-content">
            <h2 className="metrics-title">Multi-Dimensional Metrics for Stakeholder Alignment</h2>
            <div className="metrics-intro">
              <p>
                To ensure the success of AI projects, reporting must move beyond technical accuracy to include 
                a multi-dimensional set of metrics that align with various stakeholder interests, from the 
                <strong> "executive triumvirate"</strong> (CIO, CFO, and Strategy Officer) to operational teams. 
                Metrics should be categorised into several core dimensions to provide a transparent view of both 
                immediate progress and long-term value.
              </p>
            </div>

            <div className="metrics-dimensions">
              <div className="metric-dimension">
                <div className="dimension-header">
                  <span className="dimension-number">1</span>
                  <h3>Financial and Economic Metrics</h3>
                </div>
                <p className="dimension-description">
                  These are the primary KPIs for executive leadership and finance departments to justify 
                  continued investment and track the Total Cost of Ownership (TCO).
                </p>
                <ul className="dimension-list">
                  <li>
                    <strong>Return on Investment (ROI):</strong> Calculated as (Total AI-Driven Value – Total AI Investment) / 
                    Total AI Investment × 100. This should be reported as both <em>Trending ROI</em> (early indicators like 
                    productivity) and <em>Realised ROI</em> (quantifiable financial outcomes).
                  </li>
                  <li>
                    <strong>Payback Period:</strong> The time required for the cumulative value of the AI system to equal 
                    the initial investment.
                  </li>
                  <li>
                    <strong>Cost Avoidance:</strong> The value of prevented losses, such as fraud detection, avoided 
                    regulatory fines, or predictive maintenance that prevents equipment failure.
                  </li>
                  <li>
                    <strong>Levelised Cost of AI (LCOAI):</strong> An emerging 2025 metric that calculates the cost per 
                    useful output across the entire model lifecycle.
                  </li>
                </ul>
              </div>

              <div className="metric-dimension">
                <div className="dimension-header">
                  <span className="dimension-number">2</span>
                  <h3>Operational Efficiency and Productivity</h3>
                </div>
                <p className="dimension-description">
                  These metrics demonstrate how the AI serves as a "digital workforce" to enhance internal business workflows.
                </p>
                <ul className="dimension-list">
                  <li>
                    <strong>Process Cycle Time Reduction:</strong> Measuring how much faster tasks are completed compared 
                    to a human-only baseline.
                  </li>
                  <li>
                    <strong>Automation Rate:</strong> The percentage of tasks handled entirely by AI without human 
                    intervention (e.g., invoices processed automatically).
                  </li>
                  <li>
                    <strong>Throughput Increase:</strong> The volume of additional work the organisation can handle due 
                    to AI, such as a 60% increase in daily order processing.
                  </li>
                  <li>
                    <strong>Productivity Gains:</strong> Measuring the time saved per employee, allowing staff to be 
                    redeployed to higher-value strategic work.
                  </li>
                </ul>
              </div>

              <div className="metric-dimension">
                <div className="dimension-header">
                  <span className="dimension-number">3</span>
                  <h3>Strategic and Customer Impact</h3>
                </div>
                <p className="dimension-description">
                  These indicators link AI performance to the broader corporate vision and market competitiveness.
                </p>
                <ul className="dimension-list">
                  <li>
                    <strong>Revenue Growth:</strong> Tracking top-line increases from AI-driven cross-selling, dynamic 
                    pricing, or improved conversion rates.
                  </li>
                  <li>
                    <strong>Customer Experience (CX):</strong> Metrics include Customer Satisfaction (CSAT), Net Promoter 
                    Score (NPS), and the percentage of queries resolved without human escalation.
                  </li>
                  <li>
                    <strong>Decision-Making Speed:</strong> The reduction in time taken to make critical business decisions, 
                    which compresses cycles and enables faster market pivots.
                  </li>
                  <li>
                    <strong>Innovation Capacity:</strong> The number of AI-enabled features released and the percentage of 
                    the workforce upskilled in AI tools.
                  </li>
                </ul>
              </div>

              <div className="metric-dimension">
                <div className="dimension-header">
                  <span className="dimension-number">4</span>
                  <h3>Technical and Governance Metrics</h3>
                </div>
                <p className="dimension-description">
                  While technical in nature, these must be reported in a business-focused context to ensure trust and compliance.
                </p>
                <ul className="dimension-list">
                  <li>
                    <strong>Prediction Accuracy Linked to Cost:</strong> Rather than raw percentages, stakeholders should 
                    see the financial impact of false positives versus false negatives (e.g., the cost of a missed fraud 
                    case vs. a blocked legitimate customer).
                  </li>
                  <li>
                    <strong>Model Adoption and Override Rates:</strong> How often employees actually use AI recommendations 
                    and how frequently they choose to ignore them, which serves as a proxy for user trust.
                  </li>
                  <li>
                    <strong>Governance and Ethics:</strong> Tracking compliance with Responsible AI guidelines, bias 
                    detection metrics, and adherence to privacy-preserving frameworks.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="section section-overview">
          <div className="section-header">
            <span className="section-badge">Overview</span>
            <h2 className="section-title">Dashboard Architecture</h2>
            <p className="section-description">
              Ten integrated dashboards providing end-to-end visibility into your AI program's performance
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="architecture-diagram">
            <div className="arch-layer arch-browser">
              <div className="layer-title">Browser (Client)</div>
              <div className="arch-flow">
                <div className="arch-box arch-entry">
                  <div className="box-icon">📄</div>
                  <div className="box-label">index.html</div>
                  <div className="box-sublabel">Entry Point</div>
                </div>
                <div className="arch-arrow">↓</div>
                <div className="arch-box arch-bootstrap">
                  <div className="box-icon">⚛️</div>
                  <div className="box-label">main.jsx</div>
                  <div className="box-sublabel">React Bootstrap</div>
                </div>
                <div className="arch-arrow">↓</div>
                <div className="arch-box arch-root">
                  <div className="box-icon">🎯</div>
                  <div className="box-label">App.jsx</div>
                  <div className="box-sublabel">Root Component & Router</div>
                </div>
              </div>
            </div>

            <div className="arch-layer arch-components">
              <div className="layer-title">Application Components</div>
              <div className="arch-grid-3">
                <div className="arch-component">
                  <div className="component-icon">🔐</div>
                  <div className="component-name">LoginPage</div>
                  <div className="component-desc">Authentication</div>
                </div>
                <div className="arch-component">
                  <div className="component-icon">🏠</div>
                  <div className="component-name">LandingPage</div>
                  <div className="component-desc">Marketing & Info</div>
                </div>
                <div className="arch-component">
                  <div className="component-icon">📊</div>
                  <div className="component-name">Dashboard</div>
                  <div className="component-desc">Main Application</div>
                </div>
              </div>
            </div>

            <div className="arch-layer arch-dashboards">
              <div className="layer-title">10 Specialized Dashboards</div>
              <div className="arch-grid-3">
                <div className="arch-dashboard">
                  <div className="dash-number">01</div>
                  <div className="dash-name">Executive Overview</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">02</div>
                  <div className="dash-name">Business Impact</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">03</div>
                  <div className="dash-name">Operational Efficiency</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">04</div>
                  <div className="dash-name">Model Performance</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">05</div>
                  <div className="dash-name">Customer Experience</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">06</div>
                  <div className="dash-name">Innovation Capacity</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">07</div>
                  <div className="dash-name">Economic Efficiency</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">08</div>
                  <div className="dash-name">ROI Tracking</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">09</div>
                  <div className="dash-name">Project Details</div>
                </div>
                <div className="arch-dashboard">
                  <div className="dash-number">10</div>
                  <div className="dash-name">Use Case Registry</div>
                </div>
              </div>
            </div>

            <div className="arch-layer arch-visualization">
              <div className="layer-title">Visualization & Data Layer</div>
              <div className="arch-grid-2">
                <div className="arch-tech">
                  <div className="tech-icon">📈</div>
                  <div className="tech-name">Recharts</div>
                  <div className="tech-desc">Line, Bar, Area, Pie Charts</div>
                </div>
                <div className="arch-tech">
                  <div className="tech-icon">🎨</div>
                  <div className="tech-name">AWS Design System</div>
                  <div className="tech-desc">Colors & Styling</div>
                </div>
              </div>
            </div>

            <div className="arch-layer arch-tech-stack">
              <div className="layer-title">Technology Stack</div>
              <div className="tech-stack-grid">
                <div className="stack-item">
                  <div className="stack-icon">⚛️</div>
                  <div className="stack-label">React 18</div>
                </div>
                <div className="stack-item">
                  <div className="stack-icon">⚡</div>
                  <div className="stack-label">Vite 5</div>
                </div>
                <div className="stack-item">
                  <div className="stack-icon">📊</div>
                  <div className="stack-label">Recharts</div>
                </div>
                <div className="stack-item">
                  <div className="stack-icon">🎨</div>
                  <div className="stack-label">CSS3</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard 1 */}
        <section className="section dashboard-section">
          <div className="dashboard-number">01</div>
          <div className="dashboard-content">
            <h3 className="dashboard-title">Executive Overview Dashboard</h3>
            <p className="dashboard-intro">A high-level scorecard showing:</p>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <div className="feature-text">
                  <h4>Overall AI ROI</h4>
                  <p>Comprehensive ROI percentage across all initiatives</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <div className="feature-text">
                  <h4>Total Cost Savings</h4>
                  <p>Aggregated savings across all AI initiatives</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <div className="feature-text">
                  <h4>Project Portfolio</h4>
                  <p>Number of AI projects in production vs. pilot</p>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <h4>Strategic Alignment</h4>
                  <p>Alignment score with business objectives</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard 2 */}
        <section className="section dashboard-section alt">
          <div className="dashboard-number">02</div>
          <div className="dashboard-content">
            <h3 className="dashboard-title">Six-Dimensional KPI Dashboard</h3>
            <p className="dashboard-intro">Comprehensive metrics across six critical dimensions:</p>
            
            <div className="dimension-panels">
              {/* Business Impact */}
              <div className="dimension-panel">
                <div className="panel-header">
                  <span className="panel-icon">💼</span>
                  <h4>Business Impact Panel</h4>
                </div>
                <ul className="panel-metrics">
                  <li>Revenue growth from AI-enabled products</li>
                  <li>Market share metrics</li>
                  <li>Time-to-market improvements</li>
                  <li>Innovation metrics (patents filed, new business models)</li>
                </ul>
              </div>

              {/* Operational Efficiency */}
              <div className="dimension-panel">
                <div className="panel-header">
                  <span className="panel-icon">⚙️</span>
                  <h4>Operational Efficiency Panel</h4>
                </div>
                <ul className="panel-metrics">
                  <li>Process cycle time reductions (before/after comparison)</li>
                  <li>Error rate trends</li>
                  <li>Productivity gains per employee</li>
                  <li>Cost per transaction trends</li>
                </ul>
              </div>

              {/* Model Performance */}
              <div className="dimension-panel">
                <div className="panel-header">
                  <span className="panel-icon">🤖</span>
                  <h4>Model Performance Panel</h4>
                </div>
                <ul className="panel-metrics">
                  <li>Accuracy, precision, recall, F1-scores by model</li>
                  <li>For GenAI: hallucination rate tracking</li>
                  <li>Model latency under load</li>
                  <li>Fairness and bias detection scores</li>
                </ul>
              </div>

              {/* Customer Experience */}
              <div className="dimension-panel">
                <div className="panel-header">
                  <span className="panel-icon">😊</span>
                  <h4>Customer Experience Panel</h4>
                </div>
                <ul className="panel-metrics">
                  <li>CSAT and NPS trends</li>
                  <li>Average resolution time</li>
                  <li>Customer retention and churn rates</li>
                  <li>Escalation rates (e.g., chatbot to human handoff)</li>
                </ul>
              </div>

              {/* Innovation Capacity */}
              <div className="dimension-panel">
                <div className="panel-header">
                  <span className="panel-icon">💡</span>
                  <h4>Innovation Capacity Panel</h4>
                </div>
                <ul className="panel-metrics">
                  <li>AI-enabled features released per quarter</li>
                  <li>Workforce upskilling percentage</li>
                  <li>Speed of market adaptation metrics</li>
                </ul>
              </div>

              {/* Economic Efficiency */}
              <div className="dimension-panel">
                <div className="panel-header">
                  <span className="panel-icon">📈</span>
                  <h4>Economic Efficiency Panel</h4>
                </div>
                <ul className="panel-metrics">
                  <li>ROI by project</li>
                  <li>Total Cost of Ownership (TCO)</li>
                  <li>Payback period tracking</li>
                  <li>Levelized Cost of AI (LCOAI) comparisons</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard 3 */}
        <section className="section dashboard-section">
          <div className="dashboard-number">03</div>
          <div className="dashboard-content">
            <h3 className="dashboard-title">ROI Tracking Dashboard</h3>
            <p className="dashboard-intro">Four pillar view for comprehensive ROI analysis:</p>
            
            <div className="pillars-grid">
              <div className="pillar-card">
                <div className="pillar-icon">⚡</div>
                <h4>Efficiency Gains</h4>
                <p>Cost savings, reduced manual hours</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">💵</div>
                <h4>Revenue Generation</h4>
                <p>Sales conversions, new revenue streams</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">🛡️</div>
                <h4>Risk Mitigation</h4>
                <p>Fraud prevention, compliance improvements</p>
              </div>
              <div className="pillar-card">
                <div className="pillar-icon">🔄</div>
                <h4>Business Agility</h4>
                <p>Market pivot speed, regulatory adaptation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard 4 */}
        <section className="section dashboard-section alt">
          <div className="dashboard-number">04</div>
          <div className="dashboard-content">
            <h3 className="dashboard-title">Project-Level Detail Dashboard</h3>
            <p className="dashboard-intro">Deep dive into each AI initiative:</p>
            
            <div className="project-features">
              <div className="project-feature">
                <span className="feature-bullet">✓</span>
                <span>Baseline vs. current metrics</span>
              </div>
              <div className="project-feature">
                <span className="feature-bullet">✓</span>
                <span>Timeline showing construction → operational phases</span>
              </div>
              <div className="project-feature">
                <span className="feature-bullet">✓</span>
                <span>Cost per unit/inference tracking</span>
              </div>
              <div className="project-feature">
                <span className="feature-bullet">✓</span>
                <span>Business workflow integration status</span>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Section */}
        <section className="section section-implementation">
          <div className="section-header">
            <span className="section-badge">Implementation</span>
            <h2 className="section-title">Implementation Recommendations</h2>
          </div>

          <div className="implementation-grid">
            <div className="implementation-card">
              <h4>📊 Data Sources to Connect</h4>
              <ul>
                <li>Financial systems (for cost and revenue data)</li>
                <li>HR systems (for productivity metrics)</li>
                <li>CRM systems (for customer experience data)</li>
                <li>ML model monitoring platforms (for performance metrics)</li>
                <li>Project management tools (for innovation tracking)</li>
              </ul>
            </div>

            <div className="implementation-card">
              <h4>🔑 Key Features</h4>
              <ul>
                <li>Real-time automated updates</li>
                <li>Drill-down capability from executive to project level</li>
                <li>Comparative views (pilot vs. production, API vs. self-hosted)</li>
                <li>Alert thresholds for underperforming initiatives</li>
                <li>Export capabilities for executive reporting</li>
              </ul>
            </div>

            <div className="implementation-card">
              <h4>🏛️ Governance Integration</h4>
              <ul>
                <li>Executive steering committee view</li>
                <li>Responsible AI compliance tracking</li>
                <li>Cross-functional KPI ownership mapping</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Governance Framework Section */}
        <section className="section section-governance">
          <div className="governance-content">
            <div className="section-header">
              <span className="section-badge">Governance</span>
              <h2 className="section-title">AI Success Metrics Data Governance Framework</h2>
              <p className="section-description">
                Establishing policies, processes, and controls for integrity, accuracy, and reliability
              </p>
            </div>

            {/* Purpose */}
            <div className="governance-purpose">
              <h3>Purpose</h3>
              <p>
                This framework establishes the policies, processes, and controls necessary to maintain the 
                integrity, accuracy, and reliability of AI Success Metrics across nine comprehensive dashboard 
                sections, ensuring consistent measurement and transparent reporting of AI program performance.
              </p>
            </div>

            {/* Governance Structure */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">👥</span>
                Governance Structure
              </h3>
              <div className="gov-structure-grid">
                <div className="gov-box">
                  <h4>Leadership</h4>
                  <p><strong>AI Metrics Governance Board</strong> (quarterly reviews)</p>
                  <p><strong>Chair:</strong> Chief AI Officer/Chief Data Officer</p>
                  <p><strong>Members:</strong> CIO, CFO, Chief Strategy Officer, Heads of AI/ML and Data Engineering</p>
                </div>
                <div className="gov-box">
                  <h4>Six Domain-Specific Data Stewards</h4>
                  <ul>
                    <li>Business Impact (VP Business Development)</li>
                    <li>Operational Efficiency (VP Operations)</li>
                    <li>Model Performance (Head of AI/ML Engineering)</li>
                    <li>Customer Experience (VP Customer Success)</li>
                    <li>Innovation Capacity (VP Product Management)</li>
                    <li>Economic Efficiency (CFO/VP Finance)</li>
                  </ul>
                </div>
                <div className="gov-box">
                  <h4>Supporting Teams</h4>
                  <p>Data Engineering (infrastructure), Analytics (insights and validation)</p>
                </div>
              </div>
            </div>

            {/* Data Quality Framework */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">✓</span>
                Data Quality Framework
              </h3>
              <div className="quality-dimensions">
                <div className="quality-item">
                  <div className="quality-label">Accuracy</div>
                  <div className="quality-target">99.5% financial | 98% operational</div>
                </div>
                <div className="quality-item">
                  <div className="quality-label">Completeness</div>
                  <div className="quality-target">100% critical | 95% optional</div>
                </div>
                <div className="quality-item">
                  <div className="quality-label">Consistency</div>
                  <div className="quality-target">Zero conflicts in master data</div>
                </div>
                <div className="quality-item">
                  <div className="quality-label">Timeliness</div>
                  <div className="quality-target">Real-time to daily</div>
                </div>
                <div className="quality-item">
                  <div className="quality-label">Validity</div>
                  <div className="quality-target">100% schema compliance</div>
                </div>
                <div className="quality-item">
                  <div className="quality-label">Uniqueness</div>
                  <div className="quality-target">Zero duplicates</div>
                </div>
              </div>
              <p className="quality-monitoring">
                <strong>Monitoring:</strong> Automated daily, weekly, and monthly checks with quality scorecards 
                (0-100) per domain. Real-time alerts for scores &lt;95%.
              </p>
            </div>

            {/* Metric Standards */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">📋</span>
                Metric Standards
              </h3>
              <div className="metric-standards-grid">
                <div className="standard-box">
                  <h4>Comprehensive Metric Catalog</h4>
                  <ul>
                    <li>Unique identifiers and business/technical definitions</li>
                    <li>Data sources, refresh frequency, and ownership</li>
                    <li>Calculation methodologies with version control</li>
                    <li>Baseline establishment and attribution models</li>
                    <li>Change history and approval tracking</li>
                  </ul>
                </div>
                <div className="standard-box">
                  <h4>Attribution Models</h4>
                  <p><strong>Revenue:</strong> Direct, assisted, incremental, and time-decay methods</p>
                  <p><strong>Expenses:</strong> Direct savings, avoided costs, efficiency gains, and opportunity costs</p>
                </div>
              </div>
            </div>

            {/* Data Architecture */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">🏗️</span>
                Data Architecture
              </h3>
              <p className="arch-intro"><strong>Leverages Existing AWS Infrastructure:</strong></p>
              <div className="aws-services-grid">
                <div className="aws-service">
                  <div className="service-name">Amazon Timestream</div>
                  <div className="service-desc">Real-time model performance and operational metrics</div>
                </div>
                <div className="aws-service">
                  <div className="service-name">Amazon Redshift</div>
                  <div className="service-desc">Financial, customer, and innovation metrics with 5-year retention</div>
                </div>
                <div className="aws-service">
                  <div className="service-name">Amazon Neptune</div>
                  <div className="service-desc">Project dependencies and AI model lineage</div>
                </div>
                <div className="aws-service">
                  <div className="service-name">Amazon MSK/Kafka</div>
                  <div className="service-desc">Real-time streaming and event-driven updates</div>
                </div>
                <div className="aws-service">
                  <div className="service-name">Amazon CloudWatch</div>
                  <div className="service-desc">Logs, traces, and monitoring</div>
                </div>
              </div>

              {/* Agentic AI Data Sources */}
              <div className="agentic-ai-section">
                <h4 className="agentic-title">Agentic AI Data Sources</h4>
                
                <div className="agentic-grid">
                  <div className="agentic-box">
                    <div className="agentic-header">
                      <span className="agentic-icon">🤖</span>
                      <h5>AgentCore (Amazon Bedrock Agents)</h5>
                    </div>
                    <ul>
                      <li>Agent execution logs (CloudWatch)</li>
                      <li>Tool invocation traces (X-Ray)</li>
                      <li>Memory and context usage</li>
                      <li>Guardrail evaluation results</li>
                      <li>Model inference metrics</li>
                    </ul>
                  </div>

                  <div className="agentic-box">
                    <div className="agentic-header">
                      <span className="agentic-icon">🔗</span>
                      <h5>Strands (Workflow Orchestration)</h5>
                    </div>
                    <ul>
                      <li>SOP execution logs</li>
                      <li>Multi-agent coordination events</li>
                      <li>Workflow state transitions</li>
                      <li>Error and retry patterns</li>
                      <li>Orchestration performance metrics</li>
                    </ul>
                  </div>

                  <div className="agentic-box">
                    <div className="agentic-header">
                      <span className="agentic-icon">📊</span>
                      <h5>LangGraph (State Management)</h5>
                    </div>
                    <ul>
                      <li>Graph execution traces</li>
                      <li>Checkpoint persistence (DynamoDB)</li>
                      <li>State transition logs</li>
                      <li>Human-in-the-loop events</li>
                      <li>Branching and routing decisions</li>
                    </ul>
                  </div>

                  <div className="agentic-box">
                    <div className="agentic-header">
                      <span className="agentic-icon">🔌</span>
                      <h5>MCP (Model Context Protocol)</h5>
                    </div>
                    <ul>
                      <li>Tool access logs</li>
                      <li>Knowledge base queries</li>
                      <li>Resource retrieval metrics</li>
                      <li>Prompt template usage</li>
                      <li>Context window utilization</li>
                    </ul>
                  </div>
                </div>

                <div className="observability-stack">
                  <h4 className="observability-title">Observability Stack</h4>
                  <div className="observability-grid">
                    <div className="obs-item">
                      <span className="obs-icon">📈</span>
                      <div className="obs-content">
                        <div className="obs-name">Grafana</div>
                        <div className="obs-desc">Unified dashboards for agent metrics</div>
                      </div>
                    </div>
                    <div className="obs-item">
                      <span className="obs-icon">☁️</span>
                      <div className="obs-content">
                        <div className="obs-name">CloudWatch</div>
                        <div className="obs-desc">Centralized logging and alarms</div>
                      </div>
                    </div>
                    <div className="obs-item">
                      <span className="obs-icon">🔍</span>
                      <div className="obs-content">
                        <div className="obs-name">X-Ray</div>
                        <div className="obs-desc">Distributed tracing across agent calls</div>
                      </div>
                    </div>
                    <div className="obs-item">
                      <span className="obs-icon">✅</span>
                      <div className="obs-content">
                        <div className="obs-name">Bedrock Model Evaluation</div>
                        <div className="obs-desc">Quality and safety assessments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="integration-note">
                <strong>Integration:</strong> Batch (daily ETL), real-time streaming, and API-based with comprehensive error handling.
              </p>
            </div>

            {/* Security & Privacy */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">🔒</span>
                Security & Privacy
              </h3>
              <div className="security-grid">
                <div className="security-box">
                  <h4>Access Control</h4>
                  <p>Role-based (RBAC) and attribute-based (ABAC) with five user tiers:</p>
                  <ul>
                    <li>Executive</li>
                    <li>Program Manager</li>
                    <li>Data Science</li>
                    <li>Finance</li>
                    <li>Business Unit</li>
                  </ul>
                  <p>Row-level security and column-level encryption for sensitive data.</p>
                </div>
                <div className="security-box">
                  <h4>Privacy Compliance</h4>
                  <p>GDPR, CCPA, SOX, and HIPAA adherence through:</p>
                  <ul>
                    <li>PII detection</li>
                    <li>Pseudonymization</li>
                    <li>Data masking</li>
                    <li>Automated retention policies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Change Management */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">🔄</span>
                Change Management
              </h3>
              <div className="change-tiers">
                <div className="tier-box tier-minor">
                  <div className="tier-label">Minor Changes</div>
                  <p>Fast-track approval by data steward (cosmetic updates, label clarifications)</p>
                </div>
                <div className="tier-box tier-major">
                  <div className="tier-label">Major Changes</div>
                  <p>Full governance board review (metric definitions, calculation changes)</p>
                </div>
                <div className="tier-box tier-emergency">
                  <div className="tier-label">Emergency Changes</div>
                  <p>Expedited process for critical issues (security, compliance)</p>
                </div>
              </div>
              <p className="version-control">
                <strong>Version Control:</strong> Semantic versioning (MAJOR.MINOR.PATCH) for metrics, dashboards, 
                and ETL code with 90-day rollback capability.
              </p>
            </div>

            {/* Quality Assurance */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">🎯</span>
                Quality Assurance & Compliance
              </h3>
              <div className="qa-grid">
                <div className="qa-box">
                  <h4>Validation</h4>
                  <p><strong>Pre-load:</strong> Schema, data type, range checks</p>
                  <p><strong>Post-load:</strong> Reconciliation, duplicates, business rules</p>
                  <p>Monthly cross-system reconciliation with &lt;1% variance tolerance</p>
                </div>
                <div className="qa-box">
                  <h4>Audit Trail</h4>
                  <p>Comprehensive logging (1-7 year retention) covering:</p>
                  <ul>
                    <li>User access</li>
                    <li>Data modifications</li>
                    <li>Calculations</li>
                    <li>Exports</li>
                  </ul>
                  <p>SOX controls for financial metrics with quarterly internal audits and annual external audits</p>
                </div>
              </div>
            </div>

            {/* Performance & Scalability */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">⚡</span>
                Performance & Scalability
              </h3>
              <div className="performance-targets">
                <div className="perf-item">
                  <div className="perf-metric">Executive Dashboards</div>
                  <div className="perf-value">&lt;2 seconds</div>
                </div>
                <div className="perf-item">
                  <div className="perf-metric">Detailed Dashboards</div>
                  <div className="perf-value">&lt;5 seconds</div>
                </div>
                <div className="perf-item">
                  <div className="perf-metric">Complex Queries</div>
                  <div className="perf-value">&lt;10 seconds</div>
                </div>
                <div className="perf-item">
                  <div className="perf-metric">Real-time Metrics</div>
                  <div className="perf-value">&lt;1 minute</div>
                </div>
              </div>
              <p className="capacity-planning">
                <strong>Capacity Planning:</strong> Quarterly reviews with proactive scaling at 70% capacity. 
                Optimization through materialized views, partitioning, indexing, and caching.
              </p>
            </div>

            {/* Training */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">📚</span>
                Training & Continuous Improvement
              </h3>
              <div className="training-grid">
                <div className="training-box">
                  <h4>Programs</h4>
                  <ul>
                    <li>Data steward training (4 hours annually)</li>
                    <li>Dashboard user training (2 hours on-demand)</li>
                    <li>Technical team training (8 hours quarterly)</li>
                  </ul>
                </div>
                <div className="training-box">
                  <h4>Feedback Mechanisms</h4>
                  <ul>
                    <li>In-dashboard forms</li>
                    <li>Quarterly surveys</li>
                    <li>Usage analytics</li>
                    <li>Automated quality reports</li>
                  </ul>
                </div>
                <div className="training-box">
                  <h4>Innovation Pipeline</h4>
                  <ul>
                    <li>AI-powered anomaly detection</li>
                    <li>Predictive analytics</li>
                    <li>Natural language queries</li>
                    <li>Automated insight generation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">🗓️</span>
                12-Month Implementation Roadmap
              </h3>
              <div className="roadmap-phases">
                <div className="phase-box">
                  <div className="phase-header">
                    <div className="phase-number">1</div>
                    <div className="phase-title">Foundation</div>
                    <div className="phase-timeline">Months 1-3</div>
                  </div>
                  <ul>
                    <li>Establish governance board and stewards</li>
                    <li>Document metric catalog and deploy core dashboards (Sections 1-3)</li>
                    <li>Implement basic data quality checks</li>
                  </ul>
                </div>
                <div className="phase-box">
                  <div className="phase-header">
                    <div className="phase-number">2</div>
                    <div className="phase-title">Expansion</div>
                    <div className="phase-timeline">Months 4-6</div>
                  </div>
                  <ul>
                    <li>Deploy remaining dashboards (Sections 4-9)</li>
                    <li>Establish change management and advanced quality monitoring</li>
                    <li>Conduct comprehensive training</li>
                  </ul>
                </div>
                <div className="phase-box">
                  <div className="phase-header">
                    <div className="phase-number">3</div>
                    <div className="phase-title">Optimization</div>
                    <div className="phase-timeline">Months 7-9</div>
                  </div>
                  <ul>
                    <li>Optimize performance and implement automated reconciliation</li>
                    <li>Enhance security controls and develop self-service capabilities</li>
                  </ul>
                </div>
                <div className="phase-box">
                  <div className="phase-header">
                    <div className="phase-number">4</div>
                    <div className="phase-title">Maturity</div>
                    <div className="phase-timeline">Months 10-12</div>
                  </div>
                  <ul>
                    <li>Full automation of quality checks</li>
                    <li>Advanced analytics, predictive capabilities, and benchmarking</li>
                    <li>Establish continuous improvement culture</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Success Factors */}
            <div className="governance-section">
              <h3 className="gov-section-title">
                <span className="gov-icon">🎯</span>
                Key Success Factors
              </h3>
              <div className="success-factors">
                <div className="factor-item">
                  <div className="factor-icon">👔</div>
                  <div className="factor-label">Executive Sponsorship</div>
                  <div className="factor-desc">Active governance board participation</div>
                </div>
                <div className="factor-item">
                  <div className="factor-icon">📊</div>
                  <div className="factor-label">Clear Accountability</div>
                  <div className="factor-desc">Domain-specific data stewardship model</div>
                </div>
                <div className="factor-item">
                  <div className="factor-icon">🤖</div>
                  <div className="factor-label">Automation</div>
                  <div className="factor-desc">Continuous quality monitoring and alerting</div>
                </div>
                <div className="factor-item">
                  <div className="factor-icon">📚</div>
                  <div className="factor-label">Enablement</div>
                  <div className="factor-desc">Comprehensive training and documentation</div>
                </div>
                <div className="factor-item">
                  <div className="factor-icon">🔄</div>
                  <div className="factor-label">Culture</div>
                  <div className="factor-desc">Continuous improvement mindset</div>
                </div>
              </div>
            </div>

            {/* Expected Outcomes */}
            <div className="governance-outcomes">
              <h3>Expected Outcomes</h3>
              <div className="outcomes-grid">
                <div className="outcome-card">
                  <div className="outcome-value">&gt;98%</div>
                  <div className="outcome-label">Data Quality Scores</div>
                </div>
                <div className="outcome-card">
                  <div className="outcome-value">100%</div>
                  <div className="outcome-label">Transparent & Auditable</div>
                </div>
                <div className="outcome-card">
                  <div className="outcome-value">70%</div>
                  <div className="outcome-label">Reduced Manual Effort</div>
                </div>
                <div className="outcome-card">
                  <div className="outcome-value">Full</div>
                  <div className="outcome-label">Regulatory Compliance</div>
                </div>
                <div className="outcome-card">
                  <div className="outcome-value">Rapid</div>
                  <div className="outcome-label">Metric Evolution</div>
                </div>
                <div className="outcome-card">
                  <div className="outcome-value">Confident</div>
                  <div className="outcome-label">Investment Decisions</div>
                </div>
              </div>
              <p className="outcomes-summary">
                This framework transforms AI metrics from ad-hoc reporting into a strategic asset, ensuring 
                leadership can confidently measure, manage, and optimize AI program performance.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section section-cta">
          <div className="cta-content">
            <h2>Ready to Transform Your AI Program?</h2>
            <p>Start measuring what matters and drive real business impact with data-driven insights.</p>
            <button className="cta-button-large" onClick={onEnter}>
              Launch Dashboard
              <span className="arrow">→</span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>AI Success Metrics Framework</h4>
              <p>Comprehensive analytics for AI program performance</p>
            </div>
            <div className="footer-section">
              <h4>Built By</h4>
              <p>Faris Haddad</p>
              <p><a href="mailto:fahaddad@amazon.co.uk" style={{ color: 'white', opacity: 0.9 }}>fahaddad@amazon.co.uk</a></p>
            </div>
            <div className="footer-section">
              <h4>Version</h4>
              <p>1.0.0 • MIT License</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
