import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSpeechRecorder } from "../hooks/useSpeechRecorder";
import { RecordButton } from "../components/RecordButton";
import { TimerDisplay } from "../components/TimerDisplay";
import { useRecordingStore } from "../store/recordingStore";
import { colors, spacing, typography } from "../theme";
import { generateId } from "../utils/helpers";
import type { Recording } from "../types";

interface RecordingScreenProps {
  onNavigateToAnalysis?: () => void;
}

export const RecordingScreen: React.FC<RecordingScreenProps> = ({
  onNavigateToAnalysis,
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {/* Loading Overlay */}
      {isAnalyzing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Analizando tu discurso...</Text>
            <Text style={styles.loadingSubtext}>
              Esto puede tomar unos segundos
            </Text>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>SpeakEasy Coach</Text>
        <Text style={styles.subtitle}>
          {audioState.isRecording
            ? "Habla con confianza y claridad"
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: "center",
    minWidth: 280,
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
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
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 400,
  },
  tipsTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tipsText: {
    fontSize: typography.fontSize.md,
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
    color: colors.textMuted,
    textAlign: "center",
  },
});
