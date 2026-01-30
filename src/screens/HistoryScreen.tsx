import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRecordingStore } from "../store/recordingStore";
import { colors, spacing, typography } from "../theme";
import type { Recording } from "../types";

interface HistoryScreenProps {
  onBack: () => void;
  onSelectRecording: (recording: Recording) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onBack,
  onSelectRecording,
}) => {
  const { recordings } = useRecordingStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const renderItem = ({ item }: { item: Recording }) => {
    const scores = item.analysis?.scores;

    if (!scores) return null; // Skip incomplete recordings

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelectRecording(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.cardDuration}>
            {formatDuration(item.duration)}
          </Text>
        </View>

        <View style={styles.scoresRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Confianza</Text>
            <Text style={[styles.scoreValue, { color: colors.success }]}>
              {scores.confidence}/10
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Claridad</Text>
            <Text style={[styles.scoreValue, { color: colors.accent }]}>
              {scores.clarity}/10
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgPrimary} />

      <LinearGradient
        colors={[colors.bgPrimary, colors.bgSecondary]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Historial</Text>
        </View>

        {recordings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay grabaciones aún</Text>
            <Text style={styles.emptySubtext}>
              Tus análisis guardados aparecerán aquí
            </Text>
          </View>
        ) : (
          <FlatList
            data={recordings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.base,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  listContent: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  cardDate: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  cardDuration: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  scoresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  scoreLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  scoreValue: {
    fontSize: typography.fontSize.base,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
