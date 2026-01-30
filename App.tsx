import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { RecordingScreen } from "./src/screens/RecordingScreen";
import { AnalysisScreen } from "./src/screens/AnalysisScreen";

type Screen = "recording" | "analysis";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("recording");

  const navigateToAnalysis = () => {
    setCurrentScreen("analysis");
  };

  const navigateToRecording = () => {
    setCurrentScreen("recording");
  };

  return (
    <>
      <StatusBar style="light" />
      {currentScreen === "recording" ? (
        <RecordingScreen onNavigateToAnalysis={navigateToAnalysis} />
      ) : (
        <AnalysisScreen onBack={navigateToRecording} />
      )}
    </>
  );
}
