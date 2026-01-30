"""
Filler Word Detection Service
Uses Whisper for transcription and pattern matching for filler detection
"""

import whisper
import re
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class FillerWord:
    word: str
    start: float
    end: float
    confidence: float

class FillerDetector:
    """
    Detects filler words in speech using Whisper transcription
    """
    
    # Common filler words in English and Spanish
    FILLER_PATTERNS = {
        'en': [
            r'\b(um|uh|er|ah|like|you know|basically|actually|literally|sort of|kind of)\b',
            r'\b(hmm|uhh|umm|ehh)\b',
        ],
        'es': [
            r'\b(este|ehh|mmm|pues|o sea|bueno|entonces|digamos)\b',
            r'\b(ehhh|ummm|ajá)\b',
        ]
    }
    
    def __init__(self, model_size: str = "base"):
        """
        Initialize Whisper model
        
        Args:
            model_size: Whisper model size ('tiny', 'base', 'small', 'medium', 'large')
        """
        print(f"Loading Whisper model: {model_size}")
        self.model = whisper.load_model(model_size)
        self.model_size = model_size
    
    def detect(self, audio_path: str, language: str = 'es') -> List[FillerWord]:
        """
        Detect filler words in audio file
        
        Args:
            audio_path: Path to audio file
            language: Language code ('en' or 'es')
            
        Returns:
            List of detected filler words with timestamps
        """
        # Transcribe with word-level timestamps
        result = self.model.transcribe(
            audio_path,
            language=language,
            word_timestamps=True,
            verbose=False
        )
        
        fillers = []
        
        # Get filler patterns for language
        patterns = self.FILLER_PATTERNS.get(language, self.FILLER_PATTERNS['en'])
        combined_pattern = '|'.join(patterns)
        
        # Check each segment for filler words
        for segment in result.get('segments', []):
            for word_info in segment.get('words', []):
                word_text = word_info.get('word', '').strip().lower()
                
                # Check if word matches filler pattern
                if re.search(combined_pattern, word_text, re.IGNORECASE):
                    fillers.append(FillerWord(
                        word=word_text,
                        start=word_info.get('start', 0.0),
                        end=word_info.get('end', 0.0),
                        confidence=word_info.get('probability', 0.0)
                    ))
        
        return fillers
    
    def get_transcription(self, audio_path: str, language: str = 'es') -> str:
        """
        Get full transcription of audio
        
        Args:
            audio_path: Path to audio file
            language: Language code
            
        Returns:
            Full transcription text
        """
        result = self.model.transcribe(
            audio_path,
            language=language,
            verbose=False
        )
        
        return result.get('text', '')
