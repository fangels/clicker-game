export type ThemeTokens = {
  colors: {
    bg: string;
    fg: string;
    accent: string;
    muted: string;
    success: string;
    danger: string;
    surface: string;
    border: string;
  };
  fonts: {
    body: string;
    display: string;
    mono: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
};

export type ThemeDefinition = {
  tokens: ThemeTokens;
  assets?: {
    favicon?: string;
    ogImage?: string;
    backgroundImage?: string;
  };
};
