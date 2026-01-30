/**
 * API Service for SpeakEasy Coach
 * Handles communication with backend API
 */

import { Platform } from "react-native";
import type { AnalysisResult } from "../types";

// Platform-specific API URL
const getApiBaseUrl = () => {
  // For Expo Go on physical device, use your local IP
  // You can find it in the Expo Dev Tools or by running: ipconfig (Windows) / ifconfig (Mac/Linux)
  if (Platform.OS === "android") {
    // For Android (both emulator and physical device)
    // Using local IP works better than 10.0.2.2 in most cases
    return "http://192.168.2.7:8000"; // Your computer's local IP
  }

  if (Platform.OS === "ios") {
    return "http://localhost:8000"; // iOS Simulator works with localhost
  }

  // Web
  return "http://localhost:8000";
};

const API_BASE_URL = __DEV__
  ? getApiBaseUrl() // Development
  : "https://api.speakeasy-coach.com"; // Production

export class ApiService {
  /**
   * Upload audio file and get analysis
   */
  static async analyzeAudio(audioUri: string): Promise<AnalysisResult> {
    try {
      console.log("Analyzing audio:", audioUri);

      // Fetch the file as a blob
      const response = await fetch(audioUri);
      const blob = await response.blob();

      console.log("Blob type:", blob.type, "Size:", blob.size);

      // Create form data
      const formData = new FormData();

      // Extract file extension
      const uriParts = audioUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const fileName = `recording.${fileType}`;

      // Append blob as file
      formData.append("file", blob, fileName);

      console.log("Uploading to:", `${API_BASE_URL}/api/analyze`);

      // Send to API - Don't set Content-Type, FormData sets it automatically with boundary
      const apiResponse = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("API Error:", errorText);
        throw new Error(errorText || "Analysis failed");
      }

      const result: AnalysisResult = await apiResponse.json();
      console.log("Analysis complete:", result);
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servidor. Verifica que esté corriendo en http://localhost:8000",
      );
    }
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
