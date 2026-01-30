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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analizando tu discurso...</Text>
          <Text style={styles.loadingSubtext}>
            Esto puede tomar unos segundos
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentRecording?.analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Análisis de Oratoria</Text>
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
            <ScoreCard title="Ritmo" score={analysis.scores.pacing} icon="⚡" />
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
    backgroundColor: colors.bgDark,
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
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  scoresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  metricsCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgDark,
  },
  metricLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: typography.fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
  recommendationsCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  bullet: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    marginRight: spacing.sm,
    fontWeight: "700",
  },
  recommendationText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  transcriptionCard: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  transcriptionText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: "center",
  },
  backButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  bottomButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  bottomButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
