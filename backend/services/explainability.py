"""
Explainability Engine
Generates timeline markers and recommendations based on analysis
"""

from typing import List, Dict
from dataclasses import dataclass
from services.prosody_analyzer import ProsodyMetrics
from services.filler_detector import FillerWord

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
    Generates explainable AI outputs with timeline markers
    and actionable recommendations
    """
    
    # Thresholds for analysis
    OPTIMAL_WPM_RANGE = (130, 160)
    HIGH_PITCH_STD_THRESHOLD = 50  # Hz
    HIGH_ENERGY_VARIANCE_THRESHOLD = 0.4
    EXCESSIVE_PAUSES_THRESHOLD = 10
    
    # Color coding for markers
    COLORS = {
        'filler': '#FFB800',      # Amber
        'pause': '#FF6B6B',       # Red
        'fast': '#FF8C42',        # Orange
        'slow': '#4ECDC4',        # Teal
        'confident': '#95E1D3',   # Mint
        'nervous': '#F38181',     # Pink
    }
    
    def generate_report(
        self,
        prosody: ProsodyMetrics,
        fillers: List[FillerWord],
        duration: float
    ) -> Dict:
        """
        Generate complete analysis report with explainability
        
        Args:
            prosody: Prosody metrics from analyzer
            fillers: Detected filler words
            duration: Total audio duration in seconds
            
        Returns:
            Dictionary with scores, markers, and recommendations
        """
        # Calculate scores
        scores = self._calculate_scores(prosody, fillers, duration)
        
        # Generate timeline markers
        markers = self._generate_timeline_markers(prosody, fillers)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(prosody, fillers, scores)
        
        return {
            'scores': scores,
            'timeline_markers': markers,
            'recommendations': recommendations
        }
    
    def _calculate_scores(
        self,
        prosody: ProsodyMetrics,
        fillers: List[FillerWord],
        duration: float
    ) -> AnalysisScores:
        """Calculate confidence, clarity, pacing, and nervousness scores (0-10)"""
        
        # Confidence score (based on energy variance and pitch stability)
        confidence = 10.0
        if prosody.energy_variance < 0.2:
            confidence -= 2.0  # Too monotone
        if prosody.pitch_std > self.HIGH_PITCH_STD_THRESHOLD:
            confidence -= 1.5  # Unstable pitch
        confidence = max(0, min(10, confidence))
        
        # Clarity score (based on filler words)
        filler_rate = len(fillers) / (duration / 60)  # Fillers per minute
        clarity = 10.0 - min(5.0, filler_rate * 0.5)
        clarity = max(0, min(10, clarity))
        
        # Pacing score (based on speech rate)
        wpm = prosody.speech_rate_wpm
        if self.OPTIMAL_WPM_RANGE[0] <= wpm <= self.OPTIMAL_WPM_RANGE[1]:
            pacing = 10.0
        elif wpm < self.OPTIMAL_WPM_RANGE[0]:
            pacing = 10.0 - ((self.OPTIMAL_WPM_RANGE[0] - wpm) / 10)
        else:
            pacing = 10.0 - ((wpm - self.OPTIMAL_WPM_RANGE[1]) / 15)
        pacing = max(0, min(10, pacing))
        
        # Nervousness score (inverse of confidence + pause frequency)
        pause_rate = prosody.pause_count / (duration / 60)
        nervousness = 0.0
        if prosody.pitch_std > self.HIGH_PITCH_STD_THRESHOLD:
            nervousness += 3.0
        if pause_rate > 5:
            nervousness += 2.0
        if len(fillers) > 10:
            nervousness += 2.0
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
        fillers: List[FillerWord]
    ) -> List[TimelineMarker]:
        """Generate visual markers for timeline"""
        
        markers = []
        
        # Add filler word markers
        for filler in fillers:
            markers.append(TimelineMarker(
                start=filler.start,
                end=filler.end,
                type='filler',
                severity='medium' if len(fillers) > 5 else 'low',
                color=self.COLORS['filler'],
                label=f"Muletilla: '{filler.word}'",
                reason=f"Palabra de relleno detectada con {filler.confidence*100:.0f}% confianza"
            ))
        
        # Add pause markers
        for pause_time in prosody.pause_locations:
            markers.append(TimelineMarker(
                start=pause_time,
                end=pause_time + 0.5,  # Approximate pause duration
                type='pause',
                severity='high' if prosody.pause_count > self.EXCESSIVE_PAUSES_THRESHOLD else 'medium',
                color=self.COLORS['pause'],
                label="Pausa prolongada",
                reason="Silencio detectado > 0.5 segundos"
            ))
        
        # Sort markers by start time
        markers.sort(key=lambda m: m.start)
        
        return markers
    
    def _generate_recommendations(
        self,
        prosody: ProsodyMetrics,
        fillers: List[FillerWord],
        scores: AnalysisScores
    ) -> List[str]:
        """Generate actionable recommendations"""
        
        recommendations = []
        
        # Filler words
        if len(fillers) > 5:
            recommendations.append(
                f"Reduce las muletillas ({len(fillers)} detectadas). "
                "Practica hacer pausas conscientes en lugar de usar palabras de relleno."
            )
        
        # Speech rate
        wpm = prosody.speech_rate_wpm
        if wpm < self.OPTIMAL_WPM_RANGE[0]:
            recommendations.append(
                f"Tu ritmo es un poco lento ({wpm} PPM). "
                f"Intenta acelerar a {self.OPTIMAL_WPM_RANGE[0]}-{self.OPTIMAL_WPM_RANGE[1]} palabras por minuto."
            )
        elif wpm > self.OPTIMAL_WPM_RANGE[1]:
            recommendations.append(
                f"Hablas un poco rápido ({wpm} PPM). "
                "Respira profundo y reduce el ritmo para mayor claridad."
            )
        else:
            recommendations.append(
                f"¡Excelente ritmo! ({wpm} PPM está en el rango óptimo)"
            )
        
        # Pitch variation
        if prosody.pitch_std > self.HIGH_PITCH_STD_THRESHOLD:
            recommendations.append(
                "Tu tono de voz varía mucho. Practica mantener un tono más estable para proyectar confianza."
            )
        
        # Energy
        if prosody.energy_variance < 0.2:
            recommendations.append(
                "Tu voz suena monótona. Añade más énfasis y variación de volumen para mantener el interés."
            )
        
        # Pauses
        if prosody.pause_count > self.EXCESSIVE_PAUSES_THRESHOLD:
            recommendations.append(
                f"Demasiadas pausas ({prosody.pause_count}). "
                "Practica la fluidez conectando ideas de forma más natural."
            )
        
        # Overall confidence
        if scores.confidence < 6:
            recommendations.append(
                "Trabaja en proyectar más confianza: mantén contacto visual, "
                "usa gestos naturales y practica tu contenido."
            )
        
        return recommendations
