import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { colors, spacing, typography, borderRadius } from "../theme";

interface AudioPlayerProps {
  audioUri: string;
  duration: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUri,
  duration,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return () => {
      // Cleanup sound on unmount
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePlayPause = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Load and play
        setIsLoading(true);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setPosition(status.positionMillis);
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
              }
            }
          },
        );
        setSound(newSound);
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsLoading(false);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / (duration * 1000) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎧 Tu Grabación</Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
          ]}
          onPress={handlePlayPause}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.bgPrimary} />
          ) : (
            <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
          )}
        </Pressable>

        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeSeparator}>/</Text>
          <Text style={styles.timeText}>{formatTime(duration * 1000)}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  playIcon: {
    fontSize: 24,
    color: colors.bgPrimary,
  },
  timeInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  timeText: {
    fontSize: typography.fontSize.xl,
    color: colors.textPrimary,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  timeSeparator: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    fontWeight: "400",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.bgTertiary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
});
