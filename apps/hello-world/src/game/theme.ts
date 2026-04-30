import type { ThemeDefinition } from '@clicker-game/engine';

export const theme: ThemeDefinition = {
  tokens: {
    colors: {
      bg: '#0e1217',
      fg: '#e7eaf0',
      accent: '#7bc9c0',
      muted: '#6a7480',
      success: '#5fd07b',
      danger: '#ff8266',
      surface: '#171c23',
      border: '#262e38',
    },
    fonts: {
      body: '"Inter", system-ui, sans-serif',
      display: '"Inter", system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    radius: { sm: '4px', md: '8px', lg: '12px' },
    spacing: { xs: '4px', sm: '8px', md: '12px', lg: '20px', xl: '32px' },
  },
};
