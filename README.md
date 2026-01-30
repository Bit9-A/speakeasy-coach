# SpeakEasy Coach 🎙️✨

**Tu Entrenador de Oratoria Potenciado por IA Híbrida**

SpeakEasy Coach es una aplicación móvil avanzada que combina análisis de señales digitales (DSP) con inteligencia artificial generativa (Google Gemini) para ofrecerte un feedback profundo y accionable sobre tu forma de hablar. Mejora tu confianza, claridad y carisma con datos reales.

## � Características Principales

### 🧠 Análisis Híbrido (DSP + AI)

Combatimos la subjetividad fusionando dos mundos:

- **Análisis Físico (DSP)**: Usamos `librosa` y algoritmos de audio para medir científicamente tu ritmo (WPM), tono (Hz), pausas y energía.
- **Análisis Semántico (Gemini 1.5 Flash)**: Nuestro motor de IA "lee" tu discurso para evaluar la estructura de tus ideas, persuasión, sentimiento y claridad del mensaje.
- **Detección de Muletillas**: Identifica automáticamente "ehh", "mmm", "este" para limpiar tu dicción.

### 📊 Explicabilidad (XAI)

No solo te damos un número. Te explicamos **por qué**:

- **Confianza Híbrida**: ¿Suenas seguro? (60% tono de voz + 40% vocabulario asertivo).
- **Métricas Visuales**: Marcadores en una línea de tiempo interactiva muestran exactamente dónde dudaste o hablaste muy rápido.

### 💾 Persistencia e Historial

- **Tu progreso, guardado**: Todas las grabaciones se almacenan localmente en tu dispositivo.
- **Comparativa**: Revisa discursos anteriores para ver cómo ha mejorado tu puntuación de Confianza y Claridad con el tiempo.

## 🚀 Instalación y Uso

### Prerrequisitos

- **Node.js** 18+
- **Python** 3.10+
- **FFmpeg** (Instalado y agregado al PATH)
- **Expo Go** en tu móvil (o Emulador Android/iOS)

### 1. Configurar Backend (Python)

El cerebro de la aplicación.

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Crea un archivo `.env` en `backend/.env` con tu API Key de Gemini:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

Inicia el servidor:

```bash
python main.py
```

> El servidor correrá en `http://localhost:8000`.

### 2. Configurar App Móvil (React Native)

La interfaz de usuario.

```bash
cd speakeasy-coach
npm install

# Iniciar Expo
npx expo start --clear
```

Escanea el código QR con **Expo Go** en tu Android/iOS.

## 🛠️ Stack Tecnológico

**Frontend (Móvil)**

- **Framework**: React Native + Expo SDK 54
- **Lenguaje**: TypeScript
- **Estado**: Zustand (con Persistencia JSON)
- **UI**: Modern Dark Theme, Gradientes Lineales

**Backend (API)**

- **Framework**: FastAPI (Python)
- **AI/ML**:
  - **Google Gemini 1.5 Flash** (Semántica)
  - **OpenAI Whisper** (Transcripción 'small')
  - **Librosa** (Procesamiento de Audio DSP)

## 🔒 Privacidad y Seguridad

- **Procesamiento Híbrido**: El audio se procesa temporalmente para análisis y luego se descarta del servidor.
- **Almacenamiento Local**: Tus grabaciones históricas viven en TU dispositivo, no en nuestra nube.
- **API Keys**: Gestionadas vía variables de entorno seguras.

---

MIT License
