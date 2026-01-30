import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, borderRadius, typography } from "../theme";
import type { TimelineMarker as TimelineMarkerType } from "../types";

interface TimelineMarkerProps {
  marker: TimelineMarkerType;
  onPress?: () => void;
}

export const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  marker,
  onPress,
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.indicator, { backgroundColor: marker.color }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{getSeverityIcon(marker.severity)}</Text>
          <Text style={styles.label}>{marker.label}</Text>
        </View>

        {marker.reason && <Text style={styles.reason}>{marker.reason}</Text>}

        <Text style={styles.timestamp}>
          {formatTime(marker.start)} - {formatTime(marker.end)}
        </Text>
      </View>
    </Pressable>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: colors.bgCardHover,
  },
  indicator: {
    width: 4,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  reason: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
});
