import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class GeminiCoach:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️ WARNING: GEMINI_API_KEY no encontrada en .env")
            self.model = None
        else:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')

    def analyze(self, transcription: str) -> dict:
        """
        Analiza el contenido semántico del discurso usando Gemini 2.5 Flash.
        Retorna un diccionario con feedback estructurado.
        """
        if not self.model:
            return self._get_fallback_analysis()
            
        if not transcription or len(transcription.strip()) < 10:
            return self._get_empty_analysis()

        prompt = f"""
        Actúa como un coach experto en oratoria y comunicación. Analiza la siguiente transcripción de un discurso hablado:

        ---
        TRANSCRIPCIÓN:
        "{transcription}"
        ---

        Proporciona un análisis profundo en formato JSON ESTRICTO (sin bloques de código ```json y sin ** ) con la siguiente estructura:
        {{
            "content_score": (float 0-10, calidad del contenido y estructura),
            "semantic_clarity": (float 0-10, qué tan claras y bien estructuradas están las ideas),
            "semantic_confidence": (float 0-10, qué tanta seguridad transmite el TEXTO y vocabulario),
            "structure_analysis": {{
                "has_intro": (bool),
                "has_body": (bool),
                "has_conclusion": (bool),
                "feedback": "(string breve sobre la estructura)"
            }},
            "clarity_analysis": {{
                "score": (float 0-10),
                "feedback": "(string sobre la claridad de las ideas)"
            }},
            "persuasion_analysis": {{
                "detected_techniques": ["(lista de técnicas retóricas usadas si hay)"],
                "feedback": "(string sobre impacto persuasivo)"
            }},
            "sentiment_tone": "(string, ej: 'Entusiasta', 'Dubitativo', 'Autoritario', 'Empático')",
            "key_improvements": ["(lista de 2-3 mejoras accionables y específicas sobre el CONTENIDO)"],
            "positive_highlights": ["(lista de 2-3 puntos fuertes del discurso)"]
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            # Limpiar posible formato markdown del JSON
            json_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(json_text)
        except Exception as e:
            print(f"Error analizando con Gemini: {e}")
            return self._get_fallback_analysis()

    def _get_fallback_analysis(self):
        return {
            "content_score": 5.0,
            "structure_analysis": {
                "has_intro": False, "has_body": True, "has_conclusion": False,
                "feedback": "No se pudo realizar el análisis profundo con IA."
            },
            "clarity_analysis": {"score": 5.0, "feedback": "Análisis no disponible."},
            "persuasion_analysis": {"detected_techniques": [], "feedback": ""},
            "sentiment_tone": "Neutral",
            "key_improvements": ["Verifica tu conexión a internet.", "Configura una API Key válida."],
            "positive_highlights": ["La transcripción se procesó correctamente."]
        }
    
    def _get_empty_analysis(self):
        return {
            "content_score": 0.0,
            "structure_analysis": {
                "has_intro": False, "has_body": False, "has_conclusion": False,
                "feedback": "El discurso es demasiado corto para analizar."
            },
            "clarity_analysis": {"score": 0.0, "feedback": "Habla un poco más para que pueda entenderte."},
            "persuasion_analysis": {"detected_techniques": [], "feedback": ""},
            "sentiment_tone": "N/A",
            "key_improvements": ["Intenta grabar una frase completa."],
            "positive_highlights": []
        }
