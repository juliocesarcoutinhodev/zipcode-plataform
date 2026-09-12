import { Platform } from 'react-native';

export const ZipSearchColors = {
  background: '#0a0a1a',
  surfaceMidnight: '#0f172a',
  surfaceDeep: '#1e1b4b',
  accent: '#6366f1',
  accentViolet: '#8b5cf6',
  accentCyan: '#06b6d4',
  glassBg: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  error: '#ef4444',
  errorBg: 'rgba(239,68,68,0.08)',
  errorBorder: 'rgba(239,68,68,0.25)',
  warning: '#f97316',
  warningBg: 'rgba(249,115,22,0.08)',
  warningBorder: 'rgba(249,115,22,0.25)',
  success: '#10b981',
  successBg: 'rgba(16,185,129,0.15)',
  successBorder: 'rgba(16,185,129,0.3)',
  skeleton: 'rgba(255,255,255,0.06)',
  skeletonHighlight: 'rgba(255,255,255,0.12)',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'ui-monospace, monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
