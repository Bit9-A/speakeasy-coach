"""
Prosody Analysis Service
Analyzes audio features: pitch, tempo, pauses, energy
"""

import librosa
import numpy as np
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class ProsodyMetrics:
    pitch_mean: float
    pitch_std: float
    tempo_bpm: float
    pause_count: int
    pause_locations: List[float]
    energy_variance: float
    speech_rate_wpm: int

class ProsodyAnalyzer:
    """
    Analyzes speech prosody using Librosa DSP library
    """
    
    def __init__(self, sample_rate: int = 44100):
        self.sample_rate = sample_rate
        self.silence_threshold_db = 20  # dB below peak for silence detection
        self.min_pause_duration = 0.5  # seconds
    
    def analyze(self, audio_path: str) -> ProsodyMetrics:
        """
        Perform complete prosody analysis on audio file
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            ProsodyMetrics object with all analysis results
        """
        # Load audio file
        y, sr = librosa.load(audio_path, sr=self.sample_rate)
        
        # 1. Pitch Analysis (F0 tracking)
        pitch_mean, pitch_std = self._analyze_pitch(y, sr)
        
        # 2. Tempo Detection
        tempo_bpm = self._analyze_tempo(y, sr)
        
        # 3. Pause Detection
        pause_count, pause_locations = self._detect_pauses(y, sr)
        
        # 4. Energy Analysis (confidence indicator)
        energy_variance = self._analyze_energy(y)
        
        # 5. Speech Rate Estimation
        speech_rate_wpm = self._estimate_speech_rate(y, sr, pause_locations)
        
        return ProsodyMetrics(
            pitch_mean=pitch_mean,
            pitch_std=pitch_std,
            tempo_bpm=tempo_bpm,
            pause_count=pause_count,
            pause_locations=pause_locations,
            energy_variance=energy_variance,
            speech_rate_wpm=speech_rate_wpm
        )
    
    def _analyze_pitch(self, y: np.ndarray, sr: int) -> Tuple[float, float]:
        """
        Extract pitch (F0) statistics using piptrack
        
        Returns:
            (mean_pitch, std_pitch) in Hz
        """
        # Use piptrack for pitch detection
        pitches, magnitudes = librosa.piptrack(
            y=y,
            sr=sr,
            fmin=75,   # Minimum frequency (low male voice)
            fmax=400   # Maximum frequency (high female voice)
        )
        
        # Extract pitch values where magnitude is high
        pitch_values = []
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if pitch > 0:  # Valid pitch
                pitch_values.append(pitch)
        
        if len(pitch_values) == 0:
            return 0.0, 0.0
        
        pitch_array = np.array(pitch_values)
        return float(np.mean(pitch_array)), float(np.std(pitch_array))
    
    def _analyze_tempo(self, y: np.ndarray, sr: int) -> float:
        """
        Detect tempo (beats per minute)
        
        Returns:
            Tempo in BPM
        """
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        return float(tempo)
    
    def _detect_pauses(self, y: np.ndarray, sr: int) -> Tuple[int, List[float]]:
        """
        Detect pauses (silence periods) in speech
        
        Returns:
            (pause_count, pause_timestamps)
        """
        # Split audio into non-silent intervals
        intervals = librosa.effects.split(
            y,
            top_db=self.silence_threshold_db
        )
        
        # Find gaps between intervals (pauses)
        pauses = []
        for i in range(len(intervals) - 1):
            gap_start = intervals[i][1] / sr
            gap_end = intervals[i + 1][0] / sr
            gap_duration = gap_end - gap_start
            
            if gap_duration >= self.min_pause_duration:
                pauses.append(gap_start)
        
        return len(pauses), pauses
    
    def _analyze_energy(self, y: np.ndarray) -> float:
        """
        Analyze energy variance (volume consistency)
        High variance may indicate nervousness or emphasis
        
        Returns:
            Energy variance (normalized)
        """
        # Calculate RMS energy
        rms = librosa.feature.rms(y=y)[0]
        
        # Normalize and calculate variance
        rms_normalized = rms / (np.max(rms) + 1e-6)
        variance = float(np.std(rms_normalized))
        
        return variance
    
    def _estimate_speech_rate(
        self,
        y: np.ndarray,
        sr: int,
        pause_locations: List[float]
    ) -> int:
        """
        Estimate words per minute (WPM)
        
        Uses syllable detection as proxy for word count
        
        Returns:
            Estimated WPM
        """
        # Calculate total duration
        total_duration = len(y) / sr
        
        # Subtract pause time
        speaking_duration = total_duration - (len(pause_locations) * self.min_pause_duration)
        
        if speaking_duration <= 0:
            return 0
        
        # Detect onset events (syllable approximation)
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        onsets = librosa.onset.onset_detect(
            onset_envelope=onset_env,
            sr=sr,
            backtrack=True
        )
        
        # Estimate syllables (rough approximation)
        syllable_count = len(onsets)
        
        # Average: 1.5 syllables per word in English/Spanish
        word_count = syllable_count / 1.5
        
        # Convert to WPM
        wpm = int((word_count / speaking_duration) * 60)
        
        return wpm
