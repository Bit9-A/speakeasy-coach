# SpeakEasy Coach - Backend Setup Guide

## Quick Start

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note**: First run will download Whisper model (~140MB)

### 2. Install FFmpeg (Required)

**Windows (PowerShell as Administrator)**:

```powershell
# Using Chocolatey
choco install ffmpeg

# Or using winget
winget install ffmpeg
```

**macOS**:

```bash
brew install ffmpeg
```

**Linux**:

```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

### 3. Start Backend Server

```bash
cd backend
python main.py
```

Server will start at: `http://localhost:8000`

### 4. Test API

Open browser: `http://localhost:8000/docs` for interactive API documentation

## Troubleshooting

### "FFmpeg not found"

- Restart terminal after installing FFmpeg
- Verify installation: `ffmpeg -version`

### "Module not found"

```bash
pip install -r requirements.txt
```

### Slow first analysis

- Whisper model downloads on first use
- Subsequent analyses will be faster

## Next Steps

1. Keep backend running (`python main.py`)
2. Start mobile app (`npm start` in root directory)
3. Record a speech and analyze!
