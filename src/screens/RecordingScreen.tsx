import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSpeechRecorder } from "../hooks/useSpeechRecorder";
import { RecordButton } from "../components/RecordButton";
import { TimerDisplay } from "../components/TimerDisplay";
import { useRecordingStore } from "../store/recordingStore";
import { colors, spacing, typography } from "../theme";
import { generateId } from "../utils/helpers";
import type { Recording } from "../types";

interface RecordingScreenProps {
  onNavigateToAnalysis?: () => void;
  onNavigateToHistory?: () => void;
}

export const RecordingScreen: React.FC<RecordingScreenProps> = ({
  onNavigateToAnalysis,
  onNavigateToHistory,
}) => {
  const { audioState, startRecording, stopRecording, hasRecording } =
    useSpeechRecorder();
  const { addRecording, updateRecordingAnalysis, setIsAnalyzing, isAnalyzing } =
    useRecordingStore();

  const handleRecordPress = async () => {
    if (audioState.isRecording) {
      // Stop recording
      const uri = await stopRecording();

      if (uri) {
        // Create recording object
        const recording: Recording = {
          id: generateId(),
          uri,
          duration: audioState.durationMillis,
          createdAt: new Date().toISOString(),
        };

        addRecording(recording);
        setIsAnalyzing(true);

        // Analyze the recording
        try {
          const { ApiService } = await import("../services/apiService");
          const analysis = await ApiService.analyzeAudio(uri);

          // Update recording with analysis
          updateRecordingAnalysis(recording.id, analysis);

          // Reset analyzing state and navigate
          setIsAnalyzing(false);

          // Navigate to analysis screen
          if (onNavigateToAnalysis) {
            onNavigateToAnalysis();
          }
        } catch (error) {
          console.error("Analysis error:", error);
          setIsAnalyzing(false);

          Alert.alert(
            "Error de Análisis",
            "No se pudo analizar la grabación. Asegúrate de que el servidor backend esté corriendo en http://localhost:8000\n\nError: " +
              (error as Error).message,
            [
              {
                text: "Reintentar",
                onPress: async () => {
                  // Retry analysis
                  setIsAnalyzing(true);
                  try {
                    const { ApiService } =
                      await import("../services/apiService");
                    const analysis = await ApiService.analyzeAudio(uri);
                    updateRecordingAnalysis(recording.id, analysis);
                    setIsAnalyzing(false);
                    if (onNavigateToAnalysis) {
                      onNavigateToAnalysis();
                    }
                  } catch (retryError) {
                    setIsAnalyzing(false);
                    Alert.alert("Error", "No se pudo conectar con el servidor");
                  }
                },
              },
              {
                text: "Cancelar",
                style: "cancel",
              },
            ],
          );
        }
      }
    } else {
      // Start recording
      await startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      {/* Gradient Background */}
      <LinearGradient
        colors={[colors.bgPrimary, colors.bgSecondary]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Loading Overlay */}
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Analizando tu discurso...</Text>
            <Text style={styles.loadingSubtext}>
              Esto puede tomar unos segundos
            </Text>
          </View>
        </View>
      )}

      <SafeAreaView style={styles.safeArea}>
        {/* Glass Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>SpeakEasy Coach</Text>
            {!audioState.isRecording && !isAnalyzing && (
              <TouchableOpacity
                onPress={onNavigateToHistory}
                style={styles.historyButton}
              >
                <Text style={styles.historyButtonText}>📜 Historial</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.subtitle}>
            {audioState.isRecording
              ? "🎤 Habla con confianza y claridad"
              : "Toca el botón para comenzar"}
          </Text>
        </View>

        <View style={styles.content}>
          {audioState.isRecording && (
            <View style={styles.timerContainer}>
              <TimerDisplay durationMillis={audioState.durationMillis} />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <RecordButton
              isRecording={audioState.isRecording}
              onPress={handleRecordPress}
              disabled={isAnalyzing}
            />
          </View>

          {audioState.isRecording && (
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Consejos</Text>
              <Text style={styles.tipsText}>
                • Habla de forma natural{"\n"}• Mantén un ritmo constante{"\n"}•
                Evita muletillas como "ehh" o "este"
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {audioState.isRecording
              ? "Toca nuevamente para detener"
              : "Graba un discurso de al menos 30 segundos"}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 20,
    padding: spacing.xxl,
    alignItems: "center",
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },

  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
  headerTop: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  historyButton: {
    padding: spacing.sm,
    backgroundColor: colors.bgTertiary,
    borderRadius: 8,
  },
  historyButtonText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: typography.fontSize.sm,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  timerContainer: {
    marginBottom: spacing.xxl,
  },
  buttonContainer: {
    marginVertical: spacing.xl,
  },
  tipsCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tipsText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: "center",
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
