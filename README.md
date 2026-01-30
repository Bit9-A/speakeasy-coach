# SpeakEasy Coach

AI-Powered Speech Coaching with Prosody Analysis & Explainability

## 🎯 Features

- **High-Quality Audio Recording**: 44.1kHz sample rate for accurate analysis
- **Real-Time Feedback**: Live timer and visual feedback during recording
- **AI-Powered Analysis**: Prosody detection (tone, pace, pauses, filler words)
- **Explainability (XAI)**: Interactive timeline showing exactly where issues occur
- **Premium UI**: Modern dark theme with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- FFmpeg (for audio processing)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

#### 1. Install Mobile App Dependencies

```bash
cd speakeasy-coach
npm install
```

#### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Install FFmpeg**:

- **Windows**: `choco install ffmpeg` or `winget install ffmpeg`
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg`

### Running the Application

#### 1. Start Backend Server (Terminal 1)

```bash
cd backend
python main.py
```

Server runs at: `http://localhost:8000`

#### 2. Start Mobile App (Terminal 2)

```bash
# From project root
npm start

# Then press:
# - 'w' for web
# - 'i' for iOS
# - 'a' for Android
```

## 📁 Project Structure

```
speakeasy-coach/
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── screens/         # Screen components
│   ├── services/        # API and backend services
│   ├── store/           # Zustand state management
│   ├── theme/           # Design system (colors, typography)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── App.tsx              # Main app entry point
└── package.json
```

## 🎨 Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript
- **Audio**: expo-av
- **Visualization**: @shopify/react-native-skia
- **State Management**: Zustand
- **Navigation**: Expo Router (coming soon)

## 📝 Current Status

✅ Project setup complete
✅ Audio recording functionality
✅ Premium UI components
✅ State management
⏳ Backend API integration (next)
⏳ AI analysis pipeline (next)
⏳ Interactive timeline visualization (next)

## 🔒 Privacy

Voice recordings are treated as biometric data:

- End-to-end encryption
- Optional cloud processing
- Auto-deletion after 30 days
- No persistent storage without consent

## 📄 License

MIT
