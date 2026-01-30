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
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minWidth: 150,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: "600",
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
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: "400",
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.bgTertiary,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.sm,
  },
});
