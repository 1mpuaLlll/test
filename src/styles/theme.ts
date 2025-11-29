// Elevate Messenger - Premium Design System
// Neo-futurism + Glassmorphism

export const theme = {
  colors: {
    // Primary Colors - Cosmic Blue gradient
    primary: {
      main: '#0A1628',
      light: '#1a2942',
      dark: '#050b14',
      gradient: 'linear-gradient(135deg, #0A1628 0%, #1a2942 100%)',
    },

    // Accent Colors
    neonCyan: {
      main: '#00F5FF',
      light: '#33F7FF',
      dark: '#00C2CC',
      glow: '0 0 20px rgba(0, 245, 255, 0.5)',
    },

    electricPurple: {
      main: '#9333EA',
      light: '#A855F7',
      dark: '#7E22CE',
      glow: '0 0 20px rgba(147, 51, 234, 0.5)',
    },

    gold: {
      main: '#FFD700',
      light: '#FFE44D',
      dark: '#CCB700',
      glow: '0 0 20px rgba(255, 215, 0, 0.5)',
    },

    // UI Colors
    background: {
      primary: '#0A0E1A',
      secondary: '#0F1419',
      tertiary: '#1a1f2e',
      modal: 'rgba(10, 14, 26, 0.95)',
    },

    // Glassmorphism
    glass: {
      white: 'rgba(255, 255, 255, 0.05)',
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.15)',
      dark: 'rgba(0, 0, 0, 0.3)',
      border: 'rgba(255, 255, 255, 0.1)',
    },

    // Text Colors
    text: {
      primary: '#FFFFFF',
      secondary: '#A0AEC0',
      tertiary: '#718096',
      disabled: '#4A5568',
    },

    // Status Colors
    status: {
      online: '#10B981',
      offline: '#6B7280',
      away: '#F59E0B',
      busy: '#EF4444',
    },

    // Message Colors
    message: {
      sent: 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)',
      received: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
      system: 'rgba(255, 255, 255, 0.05)',
    },

    // Subscription Tiers
    subscription: {
      base: '#718096',
      premium: '#9333EA',
      vip: '#FFD700',
    },

    // NFT Rarity Colors
    nftRarity: {
      common: '#9CA3AF',
      rare: '#3B82F6',
      epic: '#A855F7',
      legendary: '#F59E0B',
    },
  },

  // Spacing System
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '1rem',    // 16px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Typography
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    '4xl': '2.5rem', // 40px
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Shadows & Effects
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 30px rgba(0, 245, 255, 0.3)',
    glowPurple: '0 0 30px rgba(147, 51, 234, 0.3)',
    glowGold: '0 0 30px rgba(255, 215, 0, 0.3)',
  },

  // Blur Effects
  blur: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '24px',
  },

  // Animations
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export type Theme = typeof theme;
