// Theme configuration for SpeakEasy Coach
// Premium design system with vibrant colors and modern aesthetics

export const colors = {
  // Primary palette
  primary: "hsl(263, 70%, 50%)", // Deep Purple
  primaryGlow: "hsl(263, 70%, 60%)", // Lighter Purple
  primaryDark: "hsl(263, 70%, 40%)", // Darker Purple

  // Semantic colors
  success: "hsl(142, 71%, 45%)", // Vibrant Green
  warning: "hsl(38, 92%, 50%)", // Gold
  error: "hsl(0, 84%, 60%)", // Soft Red
  info: "hsl(199, 89%, 48%)", // Bright Blue

  // Backgrounds
  bgDark: "hsl(222, 47%, 11%)", // Dark Navy
  bgCard: "hsl(222, 47%, 15%)", // Card Background
  bgCardHover: "hsl(222, 47%, 18%)", // Card Hover

  // Text
  textPrimary: "hsl(0, 0%, 98%)", // Almost White
  textSecondary: "hsl(0, 0%, 70%)", // Light Gray
  textMuted: "hsl(0, 0%, 50%)", // Medium Gray

  // Timeline marker colors
  markerFiller: "#FFB800", // Amber
  markerPause: "#FF6B6B", // Red
  markerFast: "#FF8C42", // Orange
  markerSlow: "#4ECDC4", // Teal
  markerConfident: "#95E1D3", // Mint
  markerNervous: "#F38181", // Pink
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
    heading: "Outfit-Bold",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  },
};
