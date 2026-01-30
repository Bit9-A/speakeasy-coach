import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";
import { formatDuration } from "../utils/helpers";

interface TimerDisplayProps {
  durationMillis: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  durationMillis,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Text style={styles.time}>{formatDuration(durationMillis)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginRight: spacing.sm,
  },
  time: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
  },
});
