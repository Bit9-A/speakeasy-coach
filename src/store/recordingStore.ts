import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Recording, AnalysisResult } from "../types";

interface RecordingStore {
  recordings: Recording[];
  currentRecording: Recording | null;
  isAnalyzing: boolean;

  // Actions
  addRecording: (recording: Recording) => void;
  setCurrentRecording: (recording: Recording | null) => void;
  updateRecordingAnalysis: (id: string, analysis: AnalysisResult) => void;
  deleteRecording: (id: string) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  clearHistory: () => void;
}

export const useRecordingStore = create<RecordingStore>()(
  persist(
    (set) => ({
      recordings: [],
      currentRecording: null,
      isAnalyzing: false,

      addRecording: (recording) =>
        set((state) => {
          // Check if recording already exists to avoid duplicates
          if (state.recordings.some((r) => r.id === recording.id)) {
            return state;
          }
          return {
            recordings: [recording, ...state.recordings],
            currentRecording: recording,
          };
        }),

      setCurrentRecording: (recording) => set({ currentRecording: recording }),

      updateRecordingAnalysis: (id, analysis) =>
        set((state) => ({
          recordings: state.recordings.map((rec) =>
            rec.id === id ? { ...rec, analysis } : rec,
          ),
          currentRecording:
            state.currentRecording?.id === id
              ? { ...state.currentRecording, analysis }
              : state.currentRecording,
        })),

      deleteRecording: (id) =>
        set((state) => ({
          recordings: state.recordings.filter((rec) => rec.id !== id),
          currentRecording:
            state.currentRecording?.id === id ? null : state.currentRecording,
        })),

      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

      clearHistory: () => set({ recordings: [], currentRecording: null }),
    }),
    {
      name: "speakeasy-main-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ recordings: state.recordings }), // Only persist recordings
    },
  ),
);
