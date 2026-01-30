"""
Explainability Engine - Enhanced Version
Generates comprehensive timeline markers and recommendations with improved accuracy
"""

from typing import List, Dict
from dataclasses import dataclass
from services.prosody_analyzer import ProsodyMetrics
from services.filler_detector import FillerWord
import numpy as np

@dataclass
class TimelineMarker:
    start: float
    end: float
    type: str
    severity: str
    color: str
    label: str
    reason: str = ""

@dataclass
class AnalysisScores:
    confidence: float
    clarity: float
    pacing: float
    nervousness: float

class ExplainabilityEngine:
    """
    Enhanced explainable AI engine with improved scoring algorithms
    and more comprehensive analysis
    """
    
    # Enhanced thresholds for Spanish speech
    OPTIMAL_WPM_RANGE = (120, 150)  # Adjusted for Spanish
    SLOW_WPM_THRESHOLD = 100
    FAST_WPM_THRESHOLD = 170
    
    # Pitch analysis (Hz)
    OPTIMAL_PITCH_STD_RANGE = (20, 45)  # Natural variation
    HIGH_PITCH_STD_THRESHOLD = 60  # Too much variation
    LOW_PITCH_STD_THRESHOLD = 15   # Too monotone
    
    # Energy and pauses
    OPTIMAL_ENERGY_VARIANCE = (0.25, 0.45)
    EXCESSIVE_PAUSES_THRESHOLD = 8
    LONG_PAUSE_DURATION = 0.8  # seconds
    
    # Filler words
    FILLER_RATE_THRESHOLDS = {
        'excellent': 2,   # < 2 per minute
        'good': 4,        # < 4 per minute
        'moderate': 7,    # < 7 per minute
        'poor': 10        # < 10 per minute
    }
    
    # Color coding for markers
    COLORS = {
        'filler': '#FBBF24',      # Amber 400
        'pause': '#F87171',       # Red 400
        'fast': '#FB923C',        # Orange 400
        'slow': '#22D3EE',        # Cyan 400
        'confident': '#34D399',   # Emerald 400
        'nervous': '#F472B6',     # Pink 400
    }
    
    def generate_report(
        self,
        prosody: ProsodyMetrics,
        fillers: List[FillerWord],
        duration: float,
        gemini_analysis: Dict = None
    ) -> Dict:
        """
        Generate comprehensive analysis report with enhanced explainability
        
        Args:
            prosody: Prosody metrics from analyzer
            fillers: Detected filler words
            duration: Total audio duration in seconds
            gemini_analysis: Optional dictionary with semantic analysis
            
        Returns:
            Dictionary with scores, markers, and recommendations
        """
        # Calculate enhanced scores
        scores = self._calculate_scores(prosody, fillers, duration, gemini_analysis)
        
        # Generate comprehensive timeline markers
        markers = self._generate_timeline_markers(prosody, fillers, duration)
        
        # Generate personalized recommendations
        recommendations = self._generate_recommendations(prosody, fillers, scores, duration)
        
        return {
            'scores': scores,
            'timeline_markers': markers,
            'recommendations': recommendations
        }
    
    def _calculate_scores(
        self,
        prosody: ProsodyMetrics,
        fillers: List[FillerWord],
        duration: float,
        gemini_analysis: Dict = None
    ) -> AnalysisScores:
        """Calculate enhanced scores fusing DSP (Acoustic) + AI (Semantic)"""
        
        # === CONFIDENCE SCORE ===
        # Based on: energy variance, pitch stability, and vocal strength
        confidence = 10.0
        
        # Energy variance (optimal range indicates confident delivery)
        if prosody.energy_variance < self.OPTIMAL_ENERGY_VARIANCE[0]:
            confidence -= 2.5  # Too monotone/flat
        elif prosody.energy_variance > self.OPTIMAL_ENERGY_VARIANCE[1]:
            confidence -= 1.5  # Too erratic
        else:
            confidence += 0.5  # Bonus for optimal range
        
        # Pitch stability (natural variation is good, too much is nervous)
        if prosody.pitch_std < self.LOW_PITCH_STD_THRESHOLD:
            confidence -= 1.5  # Too flat
        elif prosody.pitch_std > self.HIGH_PITCH_STD_THRESHOLD:
            confidence -= 2.0  # Too unstable (nervous)
        else:
            confidence += 0.5  # Bonus for natural variation
        
        # Pause frequency (too many pauses = hesitation)
        pause_rate = prosody.pause_count / max(1, duration / 60)
        if pause_rate > self.EXCESSIVE_PAUSES_THRESHOLD:
            confidence -= min(2.0, (pause_rate - self.EXCESSIVE_PAUSES_THRESHOLD) * 0.3)
        
        confidence = max(0, min(10, confidence))

        # === HYBRID FUSION: CONFIDENCE ===
        if gemini_analysis:
            # Fuse Acoustic (60%) + Semantic (40%)
            sem_conf = gemini_analysis.get('semantic_confidence', 5.0)
            confidence = (confidence * 0.6) + (sem_conf * 0.4)
            # Clip again just in case
            confidence = max(0, min(10, confidence))
        
        # === CLARITY SCORE ===
        # Based on: filler words, articulation, and speech consistency
        clarity = 10.0
        
        # Filler word rate (major factor)
        filler_rate = len(fillers) / max(1, duration / 60)
        if filler_rate < self.FILLER_RATE_THRESHOLDS['excellent']:
            clarity = 10.0
        elif filler_rate < self.FILLER_RATE_THRESHOLDS['good']:
            clarity = 8.5 - (filler_rate - 2) * 0.5
        elif filler_rate < self.FILLER_RATE_THRESHOLDS['moderate']:
            clarity = 7.0 - (filler_rate - 4) * 0.4
        elif filler_rate < self.FILLER_RATE_THRESHOLDS['poor']:
            clarity = 5.0 - (filler_rate - 7) * 0.5
        else:
            clarity = max(2.0, 5.0 - (filler_rate - 10) * 0.3)
        
        # Bonus for consistent energy (clear articulation)
        if 0.3 <= prosody.energy_variance <= 0.4:
            clarity += 0.5
        
        clarity = max(0, min(10, clarity))

        # === HYBRID FUSION: CLARITY ===
        if gemini_analysis:
            # Fuse Acoustic (50%) + Semantic (50%)
            sem_clarity = gemini_analysis.get('semantic_clarity', 5.0)
            clarity = (clarity * 0.5) + (sem_clarity * 0.5)
            
            # Content Bonus (Great content boosts clarity perception)
            content_bonus = gemini_analysis.get('content_score', 5.0)
            if content_bonus > 8.0:
               clarity = min(10, clarity * 1.1)
            
            clarity = max(0, min(10, clarity))
        
        # === PACING SCORE ===
        # Based on: speech rate and tempo consistency
        wpm = prosody.speech_rate_wpm
        pacing = 10.0
        
        if self.OPTIMAL_WPM_RANGE[0] <= wpm <= self.OPTIMAL_WPM_RANGE[1]:
            pacing = 10.0  # Perfect range
        elif wpm < self.SLOW_WPM_THRESHOLD:
            pacing = max(4.0, 10.0 - (self.SLOW_WPM_THRESHOLD - wpm) * 0.08)
        elif wpm < self.OPTIMAL_WPM_RANGE[0]:
            pacing = 8.0 + ((wpm - self.SLOW_WPM_THRESHOLD) / 
                           (self.OPTIMAL_WPM_RANGE[0] - self.SLOW_WPM_THRESHOLD)) * 2.0
        elif wpm <= self.FAST_WPM_THRESHOLD:
            pacing = 8.0 - ((wpm - self.OPTIMAL_WPM_RANGE[1]) / 
                           (self.FAST_WPM_THRESHOLD - self.OPTIMAL_WPM_RANGE[1])) * 3.0
        else:
            pacing = max(3.0, 5.0 - (wpm - self.FAST_WPM_THRESHOLD) * 0.05)
        
        pacing = max(0, min(10, pacing))
        
        # === NERVOUSNESS SCORE ===
        # Based on: pitch instability, excessive pauses, filler words
        nervousness = 0.0
        
        # Pitch instability (major nervousness indicator)
        if prosody.pitch_std > self.HIGH_PITCH_STD_THRESHOLD:
            nervousness += min(4.0, (prosody.pitch_std - self.HIGH_PITCH_STD_THRESHOLD) * 0.05)
        
        # Excessive pauses (hesitation)
        if pause_rate > self.EXCESSIVE_PAUSES_THRESHOLD:
            nervousness += min(3.0, (pause_rate - self.EXCESSIVE_PAUSES_THRESHOLD) * 0.4)
        
        # Filler words (verbal tics from nervousness)
        if filler_rate > 5:
            nervousness += min(2.5, (filler_rate - 5) * 0.3)
        
        # Energy inconsistency (nervous energy)
        if prosody.energy_variance > 0.5:
            nervousness += 1.5
        
        nervousness = max(0, min(10, nervousness))
        
        return AnalysisScores(
            confidence=round(confidence, 1),
            clarity=round(clarity, 1),
            pacing=round(pacing, 1),
            nervousness=round(nervousness, 1)
        )
    
    def _generate_timeline_markers(
        self,
        prosody: ProsodyMetrics,
        fillers: List[FillerWord],
        duration: float
    ) -> List[TimelineMarker]:
        """Generate comprehensive visual markers for timeline"""
        
        markers = []
        
        # Add filler word markers with severity based on frequency
        filler_rate = len(fillers) / max(1, duration / 60)
        for filler in fillers:
            if filler_rate > 7:
                severity = 'high'
            elif filler_rate > 4:
                severity = 'medium'
            else:
                severity = 'low'
            
            markers.append(TimelineMarker(
                start=filler.start,
                end=filler.end,
                type='filler',
                severity=severity,
                color=self.COLORS['filler'],
                label=f"Muletilla: '{filler.word}'",
                reason=f"Palabra de relleno detectada ({filler.confidence*100:.0f}% confianza). "
                       f"Tasa: {filler_rate:.1f}/min"
            ))
        
        # Add pause markers with enhanced detection
        for pause_time in prosody.pause_locations:
            # Determine severity based on pause count
            if prosody.pause_count > self.EXCESSIVE_PAUSES_THRESHOLD:
                severity = 'high'
            elif prosody.pause_count > 5:
                severity = 'medium'
            else:
                severity = 'low'
            
            markers.append(TimelineMarker(
                start=pause_time,
                end=pause_time + self.LONG_PAUSE_DURATION,
                type='pause',
                severity=severity,
                color=self.COLORS['pause'],
                label="Pausa prolongada",
                reason=f"Silencio detectado > {self.LONG_PAUSE_DURATION}s. "
                       f"Total de pausas: {prosody.pause_count}"
            ))
        
        # Sort markers by start time
        markers.sort(key=lambda m: m.start)
        
        return markers
    
    def _generate_recommendations(
        self,
        prosody: ProsodyMetrics,
        fillers: List[FillerWord],
        scores: AnalysisScores,
        duration: float
    ) -> List[str]:
        """Generate personalized, actionable recommendations"""
        
        recommendations = []
        filler_rate = len(fillers) / max(1, duration / 60)
        wpm = prosody.speech_rate_wpm
        
        # === FILLER WORDS ===
        if filler_rate > self.FILLER_RATE_THRESHOLDS['poor']:
            recommendations.append(
                f"🎯 PRIORIDAD: Reduce muletillas ({len(fillers)} detectadas, {filler_rate:.1f}/min). "
                "Practica pausas conscientes. Grábate y escucha tus patrones."
            )
        elif filler_rate > self.FILLER_RATE_THRESHOLDS['moderate']:
            recommendations.append(
                f"⚠️ Muletillas frecuentes ({len(fillers)} detectadas). "
                "Respira antes de hablar y reemplaza 'eh/um' con pausas breves."
            )
        elif filler_rate > self.FILLER_RATE_THRESHOLDS['good']:
            recommendations.append(
                f"✓ Pocas muletillas ({len(fillers)}), pero aún hay margen de mejora. "
                "Sigue practicando la fluidez."
            )
        else:
            recommendations.append(
                f"✨ ¡Excelente! Muy pocas muletillas ({len(fillers)}). Tu discurso es fluido y profesional."
            )
        
        # === SPEECH RATE ===
        if wpm < self.SLOW_WPM_THRESHOLD:
            recommendations.append(
                f"🐌 Ritmo muy lento ({wpm} PPM). Aumenta energía y reduce pausas. "
                f"Objetivo: {self.OPTIMAL_WPM_RANGE[0]}-{self.OPTIMAL_WPM_RANGE[1]} PPM."
            )
        elif wpm < self.OPTIMAL_WPM_RANGE[0]:
            recommendations.append(
                f"⏱️ Ritmo un poco lento ({wpm} PPM). Practica con un metrónomo o lee en voz alta más rápido."
            )
        elif wpm > self.FAST_WPM_THRESHOLD:
            recommendations.append(
                f"🏃 Hablas muy rápido ({wpm} PPM). Respira profundo entre frases. "
                "La claridad es más importante que la velocidad."
            )
        elif wpm > self.OPTIMAL_WPM_RANGE[1]:
            recommendations.append(
                f"⚡ Ritmo un poco rápido ({wpm} PPM). Reduce velocidad para mayor claridad y énfasis."
            )
        else:
            recommendations.append(
                f"🎯 ¡Ritmo perfecto! ({wpm} PPM). Mantienes un pace ideal para la comprensión."
            )
        
        # === PITCH VARIATION ===
        if prosody.pitch_std > self.HIGH_PITCH_STD_THRESHOLD:
            recommendations.append(
                "🎵 Tu tono varía mucho (posible nerviosismo). Practica respiración diafragmática "
                "y mantén un tono más estable para proyectar confianza."
            )
        elif prosody.pitch_std < self.LOW_PITCH_STD_THRESHOLD:
            recommendations.append(
                "📊 Voz monótona. Añade variación de tono para enfatizar puntos clave. "
                "Practica subir el tono en preguntas y bajarlo en conclusiones."
            )
        
        # === ENERGY ===
        if prosody.energy_variance < self.OPTIMAL_ENERGY_VARIANCE[0]:
            recommendations.append(
                "🔊 Tu voz suena plana. Aumenta energía y volumen en puntos importantes. "
                "Usa gestos para añadir dinamismo natural."
            )
        elif prosody.energy_variance > self.OPTIMAL_ENERGY_VARIANCE[1]:
            recommendations.append(
                "⚡ Energía inconsistente. Practica mantener un volumen más uniforme "
                "para sonar más profesional y controlado."
            )
        
        # === PAUSES ===
        pause_rate = prosody.pause_count / max(1, duration / 60)
        if pause_rate > self.EXCESSIVE_PAUSES_THRESHOLD:
            recommendations.append(
                f"⏸️ Demasiadas pausas ({prosody.pause_count} en {duration:.0f}s). "
                "Practica conectar ideas fluidamente. Usa conectores: 'además', 'por lo tanto', 'sin embargo'."
            )
        
        # === OVERALL CONFIDENCE ===
        if scores.confidence < 5:
            recommendations.append(
                "💪 Trabaja en confianza: practica frente al espejo, graba videos, "
                "y presenta primero a amigos. La práctica genera seguridad."
            )
        elif scores.confidence >= 8:
            recommendations.append(
                "🌟 ¡Proyectas mucha confianza! Sigue practicando para mantener este nivel."
            )
        
        # === CLARITY BONUS ===
        if scores.clarity >= 8.5:
            recommendations.append(
                "🎤 Tu claridad es excelente. Considera grabar contenido educativo o presentaciones."
            )
        
        return recommendations
