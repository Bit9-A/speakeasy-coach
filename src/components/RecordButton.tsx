import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Animated, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, shadows } from "../theme";

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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      // Gentle pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isRecording]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Glow ring when recording */}
      {isRecording && (
        <Animated.View
          style={[
            styles.glowRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: glowAnim,
            },
          ]}
        />
      )}

      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.buttonWrapper,
            { transform: [{ scale: scaleAnim }] },
            disabled && styles.buttonDisabled,
          ]}
        >
          <LinearGradient
            colors={
              isRecording
                ? [colors.error, colors.errorLight]
                : [
                    colors.gradientStart,
                    colors.gradientMiddle,
                    colors.gradientEnd,
                  ]
            }
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Glass overlay */}
            <View style={styles.glassOverlay} />

            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{isRecording ? "⏹" : "🎤"}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>

      {/* Label */}
      <Text style={styles.label}>{isRecording ? "Detener" : "Comenzar"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  buttonWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  button: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: colors.glassHighlight,
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 56,
  },
  label: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  glowRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.error,
    ...shadows.glow,
  },
});
