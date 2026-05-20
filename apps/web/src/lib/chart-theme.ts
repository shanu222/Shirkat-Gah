/** Feminist humanitarian chart palette */
export const CHART_COLORS = {
  primary: '#d946ef',
  secondary: '#a855f7',
  accent: '#ec4899',
  warning: '#f472b6',
  purple: '#c084fc',
} as const;

export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.warning,
  CHART_COLORS.purple,
] as const;

export const CHART_GRID_PROPS = {
  strokeDasharray: '3 3',
  stroke: 'currentColor',
  className: 'text-white/20',
} as const;

export const CHART_AXIS_STYLE = {
  tick: { fill: 'rgba(250, 245, 255, 0.65)', fontSize: 12 },
  axisLine: { stroke: 'rgba(255, 255, 255, 0.15)' },
} as const;

export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'rgba(30, 15, 40, 0.92)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '1rem',
    boxShadow: 'var(--shadow-lg)',
    fontSize: '13px',
    color: '#faf5ff',
  },
  itemStyle: { color: '#faf5ff' },
} as const;
