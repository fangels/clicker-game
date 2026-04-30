import type { ThemeDefinition } from '@clicker-game/engine';

export const applyTheme = (theme: ThemeDefinition, root: HTMLElement = document.documentElement): void => {
  const { tokens } = theme;
  const set = (name: string, value: string) => root.style.setProperty(name, value);

  set('--color-bg', tokens.colors.bg);
  set('--color-fg', tokens.colors.fg);
  set('--color-accent', tokens.colors.accent);
  set('--color-muted', tokens.colors.muted);
  set('--color-success', tokens.colors.success);
  set('--color-danger', tokens.colors.danger);
  set('--color-surface', tokens.colors.surface);
  set('--color-border', tokens.colors.border);

  set('--font-body', tokens.fonts.body);
  set('--font-display', tokens.fonts.display);
  set('--font-mono', tokens.fonts.mono);

  set('--radius-sm', tokens.radius.sm);
  set('--radius-md', tokens.radius.md);
  set('--radius-lg', tokens.radius.lg);

  set('--space-xs', tokens.spacing.xs);
  set('--space-sm', tokens.spacing.sm);
  set('--space-md', tokens.spacing.md);
  set('--space-lg', tokens.spacing.lg);
  set('--space-xl', tokens.spacing.xl);
};
