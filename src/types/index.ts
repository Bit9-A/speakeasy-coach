// Type definitions for SpeakEasy Coach

export interface AudioState {
  isRecording: boolean;
  durationMillis: number;
  uri: string | null;
}

export interface ProsodyMetrics {
  pitchMean: number;
  pitchStd: number;
  tempoBpm: number;
  pauseCount: number;
  pauseLocations: number[]; // Timestamps in seconds
  energyVariance: number;
  speechRateWpm: number;
}

export interface FillerWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface TimelineMarker {
  start: number;
  end: number;
  type: "filler" | "pause" | "fast" | "slow" | "confident" | "nervous";
  severity: "low" | "medium" | "high";
  color: string;
  label: string;
  reason?: string;
}

export interface AnalysisScores {
  confidence: number; // 0-10
  clarity: number; // 0-10
  pacing: number; // 0-10
  nervousness: number; // 0-10
}

export interface AnalysisResult {
  scores: AnalysisScores;
  timelineMarkers: TimelineMarker[];
  fillerWords: FillerWord[];
  prosodyMetrics: ProsodyMetrics;
  recommendations: string[];
  transcription?: string;
  duration: number;
  analyzedAt: string;
}

export interface Recording {
  id: string;
  uri: string;
  duration: number;
  createdAt: string;
  analysis?: AnalysisResult;
}
