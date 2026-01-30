"""
SpeakEasy Coach - FastAPI Backend
AI-Powered Speech Analysis with Prosody Detection
"""

# Add FFmpeg to PATH for Windows (if not already in system PATH)
import os
import sys
ffmpeg_path = r'C:\ffmpeg\bin'
if os.path.exists(ffmpeg_path) and ffmpeg_path not in os.environ['PATH']:
    os.environ['PATH'] = ffmpeg_path + os.pathsep + os.environ['PATH']
    print(f"✅ FFmpeg added to PATH: {ffmpeg_path}")

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime

# Import analysis services (to be created)
# from services.prosody_analyzer import ProsodyAnalyzer
# from services.filler_detector import FillerDetector
# from services.explainability import ExplainabilityEngine

app = FastAPI(
    title="SpeakEasy Coach API",
    description="AI-powered speech analysis with prosody detection and explainability",
    version="1.0.0"
)

# CORS configuration for Expo development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:19006",  # Expo web default
        "exp://localhost:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class TimelineMarker(BaseModel):
    start: float
    end: float
    type: str  # 'filler', 'pause', 'fast', 'slow', 'confident', 'nervous'
    severity: str  # 'low', 'medium', 'high'
    color: str
    label: str
    reason: Optional[str] = None

class FillerWord(BaseModel):
    word: str
    start: float
    end: float
    confidence: float

class AnalysisScores(BaseModel):
    confidence: float  # 0-10
    clarity: float  # 0-10
    pacing: float  # 0-10
    nervousness: float  # 0-10

class ProsodyMetrics(BaseModel):
    pitchMean: float
    pitchStd: float
    tempoBpm: float
    pauseCount: int
    pauseLocations: List[float]
    energyVariance: float
    speechRateWpm: int

class AnalysisResult(BaseModel):
    scores: AnalysisScores
    timelineMarkers: List[TimelineMarker]
    fillerWords: List[FillerWord]
    prosodyMetrics: ProsodyMetrics
    recommendations: List[str]
    transcription: Optional[str] = None
    duration: float
    analyzedAt: str

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "SpeakEasy Coach API",
        "version": "1.0.0"
    }

@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze_speech(file: UploadFile = File(...)):
    """
    Analyze uploaded speech audio file
    
    Returns:
    - Prosody metrics (pitch, tempo, pauses)
    - Filler word detection
    - Confidence/clarity/pacing scores
    - Timeline markers for explainability
    - Recommendations
    """
    
    # Validate file type
    if not file.content_type.startswith('audio/'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an audio file."
        )
    
    try:
        # Save uploaded file temporarily with safe filename
        import time
        
        # Create safe temp filename
        timestamp = str(time.time()).replace('.', '_')
        
        # Determine file extension safely from content type
        file_ext = 'm4a'  # Default for audio
        
        # Map content type to extension
        if file.content_type:
            content_type_map = {
                'audio/mp4': 'm4a',
                'audio/mpeg': 'mp3',
                'audio/wav': 'wav',
                'audio/wave': 'wav',
                'audio/x-wav': 'wav',
                'audio/x-m4a': 'm4a',
                'audio/webm': 'webm',
                'audio/webm;codecs=opus': 'webm',
            }
            file_ext = content_type_map.get(file.content_type, 'webm' if 'webm' in file.content_type else 'wav')
        
        # Only use filename extension if it doesn't contain blob: or http:
        if file.filename and 'blob:' not in file.filename and 'http:' not in file.filename:
            parts = file.filename.split('.')
            if len(parts) > 1 and len(parts[-1]) <= 4:  # Valid extension
                file_ext = parts[-1]
        
        temp_path = f"temp_{timestamp}.{file_ext}"
        
        print(f"Receiving file: {file.filename}, content_type: {file.content_type}")
        print(f"Saving as: {temp_path}")
        
        # Write file content
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        print(f"Saved temp file: {temp_path}, size: {len(content)} bytes")
        
        # Get audio duration
        import librosa
        y, sr = librosa.load(temp_path)
        duration = float(len(y) / sr)
        
        # Initialize analysis services
        from services.prosody_analyzer import ProsodyAnalyzer
        from services.filler_detector import FillerDetector
        from services.explainability import ExplainabilityEngine
        
        # Perform prosody analysis
        prosody_analyzer = ProsodyAnalyzer()
        prosody_metrics = prosody_analyzer.analyze(temp_path)
        
        # Detect filler words
        filler_detector = FillerDetector(model_size="base")
        fillers = filler_detector.detect(temp_path, language='es')
        transcription = filler_detector.get_transcription(temp_path, language='es')
        
        # Generate explainability report
        explainability_engine = ExplainabilityEngine()
        report = explainability_engine.generate_report(
            prosody_metrics,
            fillers,
            duration
        )
        
        # Build response
        result = AnalysisResult(
            scores=AnalysisScores(
                confidence=report['scores'].confidence,
                clarity=report['scores'].clarity,
                pacing=report['scores'].pacing,
                nervousness=report['scores'].nervousness
            ),
            timelineMarkers=[
                TimelineMarker(
                    start=m.start,
                    end=m.end,
                    type=m.type,
                    severity=m.severity,
                    color=m.color,
                    label=m.label,
                    reason=m.reason
                )
                for m in report['timeline_markers']
            ],
            fillerWords=[
                FillerWord(
                    word=f.word,
                    start=f.start,
                    end=f.end,
                    confidence=f.confidence
                )
                for f in fillers
            ],
            prosodyMetrics=ProsodyMetrics(
                pitchMean=prosody_metrics.pitch_mean,
                pitchStd=prosody_metrics.pitch_std,
                tempoBpm=prosody_metrics.tempo_bpm,
                pauseCount=prosody_metrics.pause_count,
                pauseLocations=prosody_metrics.pause_locations,
                energyVariance=prosody_metrics.energy_variance,
                speechRateWpm=prosody_metrics.speech_rate_wpm
            ),
            recommendations=report['recommendations'],
            transcription=transcription,
            duration=duration,
            analyzedAt=datetime.now().isoformat()
        )
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return result
        
    except Exception as e:
        # Clean up temp file on error
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        
        # Log full error details
        import traceback
        error_msg = str(e)
        error_trace = traceback.format_exc()
        
        print(f"\n{'='*60}")
        print(f"ERROR during analysis:")
        print(f"Error message: {error_msg}")
        print(f"Full traceback:\n{error_trace}")
        print(f"{'='*60}\n")
            
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {error_msg if error_msg else 'Unknown error - check server logs'}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
