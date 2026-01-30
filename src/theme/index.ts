// Theme configuration for SpeakEasy Coach
// Modern Dark & Professional Design System

export const colors = {
  // Dark Backgrounds (rich and deep)
  bgPrimary: "#0F172A", // Slate 900 - Deep navy
  bgSecondary: "#1E293B", // Slate 800 - Card background
  bgTertiary: "#334155", // Slate 700 - Elevated elements

  // Accents (vibrant and modern)
  accent: "#818CF8", // Indigo 400 - Primary accent
  accentLight: "#A5B4FC", // Indigo 300 - Hover states
  accentDark: "#6366F1", // Indigo 500 - Active states

  // Gradients (smooth and modern)
  gradientStart: "#6366F1", // Indigo 500
  gradientMiddle: "#8B5CF6", // Violet 500
  gradientEnd: "#A855F7", // Purple 500

  // States (vibrant on dark)
  success: "#34D399", // Emerald 400
  successLight: "#6EE7B7", // Emerald 300
  successDark: "#10B981", // Emerald 500
  warning: "#FBBF24", // Amber 400
  warningLight: "#FCD34D", // Amber 300
  error: "#F87171", // Red 400
  errorLight: "#FCA5A5", // Red 300
  info: "#60A5FA", // Blue 400

  // Texts (high contrast for dark mode)
  textPrimary: "#F1F5F9", // Slate 100 - Almost white
  textSecondary: "#CBD5E1", // Slate 300 - Medium gray
  textTertiary: "#94A3B8", // Slate 400 - Light gray

  // Borders and divisions (subtle on dark)
  border: "#334155", // Slate 700
  borderLight: "#475569", // Slate 600

  // Overlays
  overlay: "rgba(0, 0, 0, 0.7)",
  overlayLight: "rgba(0, 0, 0, 0.4)",

  // Glass effects (dark glass)
  glass: "rgba(30, 41, 59, 0.8)", // Slate 800 with transparency
  glassBorder: "rgba(71, 85, 105, 0.5)", // Slate 600 with transparency
  glassHighlight: "rgba(148, 163, 184, 0.1)", // Subtle highlight

  // Timeline marker colors (vibrant for visibility)
  markerFiller: "#FBBF24", // Amber
  markerPause: "#F87171", // Red
  markerFast: "#FB923C", // Orange
  markerSlow: "#22D3EE", // Cyan
  markerConfident: "#34D399", // Green
  markerNervous: "#F472B6", // Pink
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
    heading: "Poppins-Bold",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  // Glow effects for dark mode
  glow: {
    shadowColor: "#818CF8", // Accent color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const animations = {
  duration: {
    instant: 150,
    fast: 250,
    normal: 350,
    slow: 500,
  },
  easing: {
    easeOut: "cubic-bezier(0.33, 1, 0.68, 1)",
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  },
};
