import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { RecordingScreen } from "./src/screens/RecordingScreen";
import { AnalysisScreen } from "./src/screens/AnalysisScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { useRecordingStore } from "./src/store/recordingStore";

type Screen = "recording" | "analysis" | "history";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("recording");
  const { setCurrentRecording } = useRecordingStore();

  const navigateToAnalysis = () => {
    setCurrentScreen("analysis");
  };

  const navigateToRecording = () => {
    setCurrentScreen("recording");
    setCurrentRecording(null); // Clear selected recording when going back to record
  };

  const navigateToHistory = () => {
    setCurrentScreen("history");
  };

  const handleSelectRecording = (recording: any) => {
    setCurrentRecording(recording);
    setCurrentScreen("analysis");
  };

  return (
    <>
      <StatusBar style="light" />
      {currentScreen === "recording" ? (
        <RecordingScreen
          onNavigateToAnalysis={navigateToAnalysis}
          onNavigateToHistory={navigateToHistory}
        />
      ) : currentScreen === "history" ? (
        <HistoryScreen
          onBack={navigateToRecording}
          onSelectRecording={handleSelectRecording}
        />
      ) : (
        <AnalysisScreen onBack={navigateToRecording} />
      )}
    </>
  );
}
