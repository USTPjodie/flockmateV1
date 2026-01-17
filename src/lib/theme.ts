// FLOCKMATE Theme Configuration
export const COLORS = {
  // Primary Colors
  primary: '#00623a',        // New green - symbolizes growth and sustainability
  primaryDark: '#004d2e',    // Darker green - for headers and dark mode
  primaryLight: '#e0f2e9',   // Light green - for subtle gradients
  accent: '#BB8A52',         // Warm brown-gold - for highlights and buttons
  highlight: '#FFBA00',      // Vibrant yellow - for gamification and key actions
  
  // Neutral Colors
  white: '#FFFFFF',
  lightGray: '#F8FAFC',
  gray: '#94A3B8',
  darkGray: '#334155',
  black: '#0F172A',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Gamification Colors
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
};

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const SIZES = {
  // Font sizes
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
  xxxlarge: 24,
  huge: 28,
  massive: 32,
  
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
};

// Light and Dark theme configurations
export const LIGHT_THEME = {
  background: COLORS.lightGray,
  backgroundGradient: [COLORS.lightGray, COLORS.primaryLight], // Gradient from light gray to light green
  cardBackground: COLORS.white,
  text: COLORS.black,
  textSecondary: COLORS.gray,
  textTertiary: COLORS.darkGray,
  header: COLORS.primaryDark,
  statusBar: 'dark-content',
  ...COLORS,
};

export const DARK_THEME = {
  background: COLORS.primaryDark,
  backgroundGradient: [COLORS.primaryDark, '#00331f'], // Gradient from deep green to slightly lighter green
  cardBackground: '#1E293B',
  text: COLORS.white,
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  header: COLORS.primaryDark,
  statusBar: 'light-content',
  ...COLORS,
};

// Gradient definitions for background
export const GRADIENTS = {
  light: {
    colors: [COLORS.lightGray, COLORS.primaryLight],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  },
  dark: {
    colors: [COLORS.primaryDark, '#00331f'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  }
};