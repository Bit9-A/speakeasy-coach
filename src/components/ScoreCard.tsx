import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, borderRadius, typography } from "../theme";
import { getScoreColor } from "../utils/helpers";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon?: string;
  onPress?: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore = 10,
  icon,
  onPress,
}) => {
  const percentage = (score / maxScore) * 100;
  const scoreColor = getScoreColor(score);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: scoreColor }]}>
          {score.toFixed(1)}
        </Text>
        <Text style={styles.maxScore}>/{maxScore}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: scoreColor,
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minWidth: 150,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: spacing.sm,
  },
  score: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "700",
  },
  maxScore: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.sm,
  },
});
