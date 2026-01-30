/**
 * Utility functions for SpeakEasy Coach
 */

/**
 * Format duration in milliseconds to MM:SS format
 */
export const formatDuration = (millis: number): string => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Format duration in seconds to MM:SS format
 */
export const formatSeconds = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get color based on score (0-10)
 */
export const getScoreColor = (score: number): string => {
  if (score >= 8) return "hsl(142, 71%, 45%)"; // Green
  if (score >= 6) return "hsl(38, 92%, 50%)"; // Yellow
  return "hsl(0, 84%, 60%)"; // Red
};

/**
 * Get severity label based on score
 */
export const getSeverityLabel = (score: number): "high" | "medium" | "low" => {
  if (score >= 8) return "high";
  if (score >= 6) return "medium";
  return "low";
};

/**
 * Convert HSL color string to RGB values
 */
export const hslToRgb = (hsl: string): { r: number; g: number; b: number } => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return { r: 0, g: 0, b: 0 };

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};
