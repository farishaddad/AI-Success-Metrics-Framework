// AWS Design System - Chart Configuration

export const AWS_COLORS = {
  primary: '#0073BB',
  success: '#1D8102',
  warning: '#FF9900',
  danger: '#D13212',
  neutral: '#687078',
  background: '#FFFFFF',
  secondaryBg: '#F2F3F3',
};

// Chart color palette for multi-series data
export const CHART_COLORS = [
  '#0073BB', // AWS Blue
  '#1D8102', // Green
  '#FF9900', // Orange
  '#D13212', // Red
  '#687078', // Gray
  '#00A1C9', // Cyan
  '#7D2105', // Dark Red
  '#146EB4', // Dark Blue
];

// Status colors
export const STATUS_COLORS = {
  production: AWS_COLORS.success,
  pilot: AWS_COLORS.warning,
  development: AWS_COLORS.primary,
  onHold: AWS_COLORS.neutral,
  optimization: '#00A1C9',
};

// Chart grid and axis styling
export const CHART_STYLES = {
  grid: {
    stroke: '#E5E7EB',
    strokeWidth: 1,
    strokeDasharray: '3 3',
  },
  axis: {
    fontSize: 12,
    fill: AWS_COLORS.neutral,
  },
  legend: {
    fontSize: 12,
    iconSize: 12,
  },
  tooltip: {
    contentStyle: {
      background: AWS_COLORS.background,
      border: `1px solid ${AWS_COLORS.secondaryBg}`,
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
      fontSize: 14,
    },
    labelStyle: {
      color: AWS_COLORS.neutral,
      fontWeight: 600,
    },
  },
};

// Gauge colors for different ranges
export const GAUGE_COLORS = {
  danger: { min: 0, max: 60, color: AWS_COLORS.danger },
  warning: { min: 61, max: 80, color: AWS_COLORS.warning },
  success: { min: 81, max: 100, color: AWS_COLORS.success },
};

// Export button styling
export const EXPORT_BUTTON_STYLE = {
  padding: '8px 16px',
  background: AWS_COLORS.primary,
  color: AWS_COLORS.background,
  border: 'none',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 300ms ease-in-out',
};
