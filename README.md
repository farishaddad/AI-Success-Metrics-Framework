# AI Success Metrics Dashboard

A comprehensive React-based dashboard system for tracking and visualizing AI program success metrics across multiple dimensions, built with AWS Design System specifications.

## Features

### 9 Specialized Dashboards

1. **Executive Overview** - High-level health score, ROI, cost savings, and strategic alignment
2. **Business Impact** - Revenue growth, market share, time-to-market, and innovation metrics
3. **Operational Efficiency** - Process optimization, error reduction, productivity gains
4. **Model Performance** - Technical metrics, classification performance, GenAI metrics, fairness analysis
5. **Customer Experience** - CSAT, NPS, resolution metrics, churn analysis
6. **Innovation Capacity** - Innovation velocity, workforce upskilling, market adaptation
7. **Economic Efficiency** - ROI analysis, cost breakdown, payback timelines
8. **ROI Tracking** - Detailed ROI by four pillars (Efficiency, Revenue, Risk, Agility)
9. **Project Details** - Project-level drill-down with lifecycle, costs, and performance

## AWS Design System

### Color Palette

```css
Primary: #0073BB (AWS Blue)
Success: #1D8102 (Green)
Warning: #FF9900 (Orange)
Danger: #D13212 (Red)
Neutral: #687078 (Gray)
Background: #FFFFFF (White)
Secondary Background: #F2F3F3 (Light Gray)
```

### Typography

- **Headers**: 24px, Bold, Primary color
- **Sub-headers**: 18px, Semi-bold, Neutral color
- **Body**: 14px, Regular, Neutral color
- **KPI Numbers**: 36-48px, Bold, Context color
- **Labels**: 12px, Regular, Neutral color

### Chart Specifications

- **Grid lines**: Light gray (#E5E7EB), 1px, dashed
- **Axis labels**: 12px, Neutral color
- **Legends**: Bottom or right, 12px
- **Tooltips**: White background, shadow, 14px text
- **Animations**: 300ms ease-in-out transitions

### Responsive Behavior

- **Desktop (>1200px)**: Full layout with 2-4 column grids
- **Tablet (768-1200px)**: 2-column grid, stacked sections
- **Mobile (<768px)**: Single column, scrollable cards

### Interactivity

- **Hover**: Subtle shadow and transform effects (translateY -2px)
- **Transitions**: 300ms ease-in-out for all interactive elements
- **Color Feedback**: Context-aware colors (success, warning, danger)

## Technology Stack

- **React 18** - UI framework
- **Recharts 2.10** - Data visualization library
- **Vite 5** - Build tool and dev server
- **CSS Variables** - Design system implementation

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Dashboard components
│   ├── Dashboard.jsx           # Executive Overview
│   ├── BusinessImpactDashboard.jsx
│   ├── OperationalEfficiencyDashboard.jsx
│   ├── ModelPerformanceDashboard.jsx
│   ├── CustomerExperienceDashboard.jsx
│   ├── InnovationCapacityDashboard.jsx
│   ├── EconomicEfficiencyDashboard.jsx
│   ├── ROITrackingDashboard.jsx
│   ├── ProjectLevelDashboard.jsx
│   └── [various panel components]
├── utils/
│   └── chartConfig.js   # Shared chart configuration
├── App.jsx              # Main app with tab navigation
├── App.css              # App-level styles
└── index.css            # Global styles & design system
```

## Design System Usage

### Using CSS Variables

All components use CSS variables defined in `index.css`:

```css
var(--aws-primary)      /* #0073BB */
var(--aws-success)      /* #1D8102 */
var(--aws-warning)      /* #FF9900 */
var(--aws-danger)       /* #D13212 */
var(--aws-neutral)      /* #687078 */
var(--aws-bg-primary)   /* #FFFFFF */
var(--aws-bg-secondary) /* #F2F3F3 */
```

### Chart Configuration

Import shared chart configuration:

```javascript
import { AWS_COLORS, CHART_COLORS, CHART_STYLES } from '../utils/chartConfig';
```

### Responsive Components

All panels include hover effects and responsive behavior:

```css
.panel:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

## Dashboard Details

### 1. Executive Overview
- AI Program Health Score (0-100 gauge)
- Overall AI ROI with trend sparkline
- Cost Savings Summary (stacked bar chart)
- Project Portfolio Status (donut chart)
- Strategic Alignment Score (bullet charts)

### 2. Business Impact
- Four KPI cards (Revenue Growth, Market Share, Time-to-Market, Innovation Index)
- Revenue Attribution (waterfall chart)
- Time-to-Market Comparison (grouped bar chart)

### 3. Operational Efficiency
- Process Cycle Time (line chart with dual axis)
- Error Rate Reduction (area chart)
- Productivity Gains (bar chart with target line)
- Cost per Transaction (combo chart)
- Task-Level ROI Table (sortable data table)

### 4. Model Performance
- Model Health Overview (status grid)
- Classification Metrics (radar chart)
- GenAI Specific Metrics (gauge cluster)
- Performance Under Load (scatter plot)
- Fairness & Bias Metrics (heatmap)

### 5. Customer Experience
- Primary CX Metrics (CSAT, NPS, Resolution Time cards)
- Resolution Funnel (funnel chart)
- Churn Analysis (line chart with annotations)
- Customer Retention Cohort (heatmap)

### 6. Innovation Capacity
- Innovation Velocity (combo chart)
- Workforce Upskilling (progress bars)
- Market Adaptation Speed (timeline/Gantt)
- Innovation Pipeline (Kanban board)

### 7. Economic Efficiency
- Financial KPIs (ROI, TCO, Payback Period, LCOAI)
- ROI by Four Pillars (stacked bar chart)
- Cost Breakdown (bar chart)
- Payback Timeline (area chart)

### 8. ROI Tracking
- Tabbed interface with four pillars
- Detailed charts for each pillar
- Comprehensive ROI analysis

### 9. Project Details
- Project selector dropdown
- Lifecycle timeline visualization
- Baseline metrics comparison table
- Cost analysis area chart
- Business impact scorecard
- Model performance time series

## Component Guidelines

### Panel Component

- Use `.panel` class for consistent styling
- Include `.panel-title` for headers (24px, bold, primary color)
- Add hover effects for interactivity
- Ensure responsive padding (24px desktop, 16px mobile)

### KPI Cards

- Display large numbers (36-48px) with context colors
- Include comparison indicators (positive/negative)
- Show trend sparklines where applicable
- Use icon containers with background colors

### Charts

- Apply consistent grid styling (dashed, light gray)
- Use AWS color palette for data series
- Include tooltips with white background and shadow
- Ensure legends are positioned bottom or right
- Add 300ms transitions for animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- All charts use `ResponsiveContainer` for fluid layouts
- Transitions limited to 300ms for smooth performance
- Mock data generation optimized for quick rendering
- Component-level error boundaries for graceful failures

## Future Enhancements

- [ ] Global date range filters
- [ ] Project and department filters
- [ ] PDF/Excel export functionality
- [ ] Auto-refresh every 5 minutes
- [ ] Drill-down detail views
- [ ] Real-time data integration
- [ ] User preferences and saved views
- [ ] Dark mode support

## License

MIT
