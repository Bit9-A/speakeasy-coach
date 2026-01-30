import { useState, useCallback } from "react";
import { Audio } from "expo-av";
import { Alert } from "react-native";
import type { AudioState } from "../types";

// High-quality recording configuration for DSP analysis
const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100, // High fidelity required for pitch analysis
    numberOfChannels: 1, // Mono for speech
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};

/**
 * Custom hook for robust audio recording with permission handling
 * and graceful error management
 */
export const useSpeechRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    durationMillis: 0,
    uri: null,
  });

  const startRecording = useCallback(async () => {
    try {
      // 1. Request microphone permissions
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Acceso Denegado",
          "Se requiere acceso al micrófono para analizar tu oratoria. Por favor, habilita los permisos en la configuración.",
        );
        return;
      }

      // 2. Configure audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 3. Start recording
      const { recording: newRecording } =
        await Audio.Recording.createAsync(RECORDING_OPTIONS);

      setRecording(newRecording);
      setAudioState((prev) => ({ ...prev, isRecording: true }));

      // 4. Set up status update listener for real-time duration
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          setAudioState((prev) => ({
            ...prev,
            durationMillis: status.durationMillis,
          }));
        }
      });
    } catch (err) {
      console.error("Error al iniciar grabación:", err);
      Alert.alert(
        "Error Técnico",
        "No se pudo inicializar el motor de audio. Por favor, intenta nuevamente.",
      );
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();

      setRecording(null);
      setAudioState({
        isRecording: false,
        durationMillis: status.durationMillis,
        uri: uri,
      });

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      return uri;
    } catch (err) {
      console.error("Error al detener grabación:", err);
      Alert.alert("Error", "Hubo un problema al finalizar la grabación.");
    }
  }, [recording]);

  const cancelRecording = useCallback(async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setAudioState({
        isRecording: false,
        durationMillis: 0,
        uri: null,
      });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (err) {
      console.error("Error al cancelar grabación:", err);
    }
  }, [recording]);

  return {
    audioState,
    startRecording,
    stopRecording,
    cancelRecording,
    hasRecording: !!audioState.uri,
  };
};
