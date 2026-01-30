import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRecordingStore } from "../store/recordingStore";
import { ScoreCard } from "../components/ScoreCard";
import { TimelineMarker } from "../components/TimelineMarker";
import { AudioPlayer } from "../components/AudioPlayer";
import { colors, spacing, typography, borderRadius } from "../theme";
import { formatSeconds } from "../utils/helpers";

interface AnalysisScreenProps {
  onBack?: () => void;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ onBack }) => {
  const { currentRecording, isAnalyzing } = useRecordingStore();

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.bgPrimary}
        />
        <LinearGradient
          colors={[colors.bgPrimary, colors.bgSecondary]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Analizando tu discurso...</Text>
            <Text style={styles.loadingSubtext}>
              Esto puede tomar unos segundos
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!currentRecording?.analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.bgPrimary}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay análisis disponible</Text>
          {onBack && (
            <Pressable onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Volver</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const { analysis } = currentRecording;

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

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>✨ Análisis Completo</Text>
            <Text style={styles.duration}>
              Duración: {formatSeconds(analysis.duration)}
            </Text>
          </View>

          {/* Audio Player */}
          <AudioPlayer
            audioUri={currentRecording.uri}
            duration={analysis.duration}
          />

          {/* Scores Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Puntuaciones</Text>
            <View style={styles.scoresGrid}>
              <ScoreCard
                title="Confianza"
                score={analysis.scores.confidence}
                icon="💪"
              />
              <ScoreCard
                title="Claridad"
                score={analysis.scores.clarity}
                icon="✨"
              />
              <ScoreCard
                title="Ritmo"
                score={analysis.scores.pacing}
                icon="⚡"
              />
              <ScoreCard
                title="Nerviosismo"
                score={10 - analysis.scores.nervousness}
                icon="😌"
              />
            </View>
          </View>

          {/* Metrics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Métricas de Voz</Text>
            <View style={styles.metricsCard}>
              <MetricRow
                label="Palabras por minuto"
                value={`${analysis.prosodyMetrics.speechRateWpm} PPM`}
              />
              <MetricRow
                label="Pausas detectadas"
                value={`${analysis.prosodyMetrics.pauseCount}`}
              />
              <MetricRow
                label="Muletillas encontradas"
                value={`${analysis.fillerWords.length}`}
              />
              <MetricRow
                label="Tono promedio"
                value={`${analysis.prosodyMetrics.pitchMean.toFixed(0)} Hz`}
              />
            </View>
          </View>

          {/* Timeline Markers */}
          {analysis.timelineMarkers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Puntos de Mejora</Text>
              {analysis.timelineMarkers.map((marker, index) => (
                <TimelineMarker
                  key={index}
                  marker={marker}
                  onPress={() => {
                    // TODO: Seek to timestamp in audio playback
                    console.log("Jump to", marker.start);
                  }}
                />
              ))}
            </View>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Recomendaciones</Text>
              <View style={styles.recommendationsCard}>
                {analysis.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Transcription */}
          {analysis.transcription && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Transcripción</Text>
              <View style={styles.transcriptionCard}>
                <Text style={styles.transcriptionText}>
                  {analysis.transcription}
                </Text>
              </View>
            </View>
          )}

          {/* Back Button */}
          {onBack && (
            <Pressable onPress={onBack} style={styles.bottomButton}>
              <Text style={styles.bottomButtonText}>Nueva Grabación</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MetricRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.metricRow}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  duration: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  scoresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  metricsCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metricLabel: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: typography.fontSize.base,
    fontWeight: "600",
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  recommendationsCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  bullet: {
    fontSize: typography.fontSize.base,
    color: colors.accent,
    marginRight: spacing.sm,
    fontWeight: "700",
  },
  recommendationText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  transcriptionCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  transcriptionText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignSelf: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.bgPrimary,
  },
  bottomButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    marginTop: spacing.xl,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.bgPrimary,
  },
});
