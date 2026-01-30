"""
Filler Word Detection Service - Enhanced for Accuracy
Uses Whisper 'small' model with optimized parameters to prevent hallucinations
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
            r'\b(ehhh|ummm|ajá|emm|mjm)\b',
        ]
    }
    
    def __init__(self, model_size: str = "small"):
        """
        Initialize Whisper model
        
        Args:
            model_size: Whisper model size. Defaults to 'small' for better accuracy than 'base'.
        """
        print(f"Loading Whisper model: {model_size}")
        try:
            self.model = whisper.load_model(model_size)
        except Exception:
            print("Failed to load requested model, falling back to base")
            self.model = whisper.load_model("base")
        self.model_size = model_size
    
    def _transcribe_optimized(self, audio_path: str, language: str, word_timestamps: bool = False):
        """
        Helper to run transcription with anti-hallucination parameters
        """
        # Context prompt helps Whisper stick to the correct language and context
        initial_prompt = (
            "Esta es una grabación clara de un discurso o presentación en español. "
            "El orador habla con fluidez sobre un tema específico."
        )
        
        return self.model.transcribe(
            audio_path,
            language=language,
            word_timestamps=word_timestamps,
            verbose=False,
            # Anti-hallucination & Anti-loop parameters:
            temperature=0.0,           # Deterministic output
            best_of=5,                 # Beam search size
            beam_size=5,               # Higher beam size
            patience=1.0,              
            
            # CRITICAL FIXES FOR REPETITION LOOPS:
            condition_on_previous_text=False, # Disable context looking back (prevents "Hola Hola Hola")
            compression_ratio_threshold=1.35, # Aggressively fail if text is too repetitive
            logprob_threshold=-0.8,           # Discard detection if confidence is low
            no_speech_threshold=0.4,          # Higher threshold for expecting silence
            
            initial_prompt=initial_prompt
        )

    def detect(self, audio_path: str, language: str = 'es') -> List[FillerWord]:
        """
        Detect filler words in audio file
        """
        # Transcribe with word-level timestamps
        result = self._transcribe_optimized(audio_path, language, word_timestamps=True)
        
        fillers = []
        
        # Get filler patterns for language
        patterns = self.FILLER_PATTERNS.get(language, self.FILLER_PATTERNS['en'])
        combined_pattern = '|'.join(patterns)
        
        # Check each segment for filler words
        for segment in result.get('segments', []):
            for word_info in segment.get('words', []):
                word_text = word_info.get('word', '').strip().lower()
                # Clean punctuation
                word_text = re.sub(r'[.,¡!¿?]', '', word_text)
                
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
        """
        result = self._transcribe_optimized(audio_path, language, word_timestamps=False)
        return result.get('text', '').strip()
