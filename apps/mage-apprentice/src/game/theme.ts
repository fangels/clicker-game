import type { ThemeDefinition } from '@clicker-game/engine';

export const theme: ThemeDefinition = {
  tokens: {
    colors: {
      bg: '#14101f',
      fg: '#f0e6d2',
      accent: '#d4af37',
      muted: '#8a7ca8',
      success: '#7be3a3',
      danger: '#ff5e6c',
      surface: '#1d1830',
      border: '#2e2742',
    },
    fonts: {
      body: '"Lora", Georgia, "Times New Roman", serif',
      display: '"Cinzel", "Trajan Pro", Georgia, serif',
      mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    radius: { sm: '4px', md: '8px', lg: '14px' },
    spacing: { xs: '4px', sm: '8px', md: '12px', lg: '20px', xl: '32px' },
  },
};
