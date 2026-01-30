import React from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { colors, spacing, borderRadius, typography } from "../theme";

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  onPress,
  disabled = false,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          isRecording && styles.recording,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <View style={[styles.inner, isRecording && styles.innerRecording]} />
      </Animated.View>
      <Text style={styles.label}>
        {isRecording ? "Grabando..." : "Iniciar Grabación"}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  recording: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  inner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  innerRecording: {
    borderRadius: 12,
    width: 40,
    height: 40,
  },
  label: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
