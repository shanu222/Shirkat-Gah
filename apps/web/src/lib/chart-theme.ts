/** Enterprise chart color palette — light/dark aware */
export const CHART_COLORS = {
  primary: '#047857',
  secondary: '#0ea5e9',
  accent: '#14b8a6',
  warning: '#f97316',
  purple: '#8b5cf6',
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
  className: 'text-border/40',
} as const;

export const CHART_AXIS_STYLE = {
  tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 },
  axisLine: { stroke: 'hsl(var(--border))' },
} as const;

export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.75rem',
    boxShadow: 'var(--shadow-md)',
    fontSize: '13px',
  },
  itemStyle: { color: 'hsl(var(--foreground))' },
} as const;
