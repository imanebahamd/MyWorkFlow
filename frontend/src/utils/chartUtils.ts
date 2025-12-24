export const chartColors = {
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
  gray: '#6b7280'
};

export const getChartColors = (count: number) => {
  const colors = Object.values(chartColors);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

export const getGradientColors = (baseColor: string, count: number) => {
  const result = [];
  const base = parseInt(baseColor.replace('#', ''), 16);
  
  for (let i = 0; i < count; i++) {
    const factor = 0.8 + (i * 0.2);
    const r = Math.min(255, Math.floor(((base >> 16) & 255) * factor));
    const g = Math.min(255, Math.floor(((base >> 8) & 255) * factor));
    const b = Math.min(255, Math.floor((base & 255) * factor));
    result.push(`rgb(${r}, ${g}, ${b})`);
  }
  
  return result;
};

export const formatChartNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};