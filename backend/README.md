# SpeakEasy Coach Backend

FastAPI backend for AI-powered speech analysis with prosody detection and explainability.

## Features

- **Prosody Analysis**: Pitch, tempo, pause detection using Librosa
- **Filler Word Detection**: Whisper-based transcription with pattern matching
- **Explainability Engine**: Timeline markers and actionable recommendations
- **CORS Support**: Ready for Expo development

## Installation

### Prerequisites

- Python 3.11+
- FFmpeg (required for Librosa audio processing)

### Install FFmpeg

**Windows**:

```bash
# Using Chocolatey
choco install ffmpeg

# Or download from: https://ffmpeg.org/download.html
```

**macOS**:

```bash
brew install ffmpeg
```

**Linux**:

```bash
sudo apt-get install ffmpeg
```

### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note**: First run will download Whisper model (~140MB for 'base' model)

## Running the Server

```bash
cd backend
python main.py
```

Server will start at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## API Endpoints

### `GET /`

Health check endpoint

### `POST /api/analyze`

Upload audio file for analysis

**Request**:

- Method: POST
- Content-Type: multipart/form-data
- Body: audio file (m4a, wav, mp3)

**Response**:

```json
{
  "scores": {
    "confidence": 7.5,
    "clarity": 8.0,
    "pacing": 6.5,
    "nervousness": 4.0
  },
  "timelineMarkers": [...],
  "fillerWords": [...],
  "prosodyMetrics": {...},
  "recommendations": [...],
  "transcription": "...",
  "duration": 90.5,
  "analyzedAt": "2026-01-30T14:00:00"
}
```

## Architecture

```
backend/
├── main.py                    # FastAPI application
├── requirements.txt           # Python dependencies
└── services/
    ├── prosody_analyzer.py    # Librosa-based analysis
    ├── filler_detector.py     # Whisper transcription
    └── explainability.py      # Score calculation & markers
```

## Development

### Testing with cURL

```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@recording.m4a"
```

### Testing with Postman

1. Create POST request to `http://localhost:8000/api/analyze`
2. Set Body type to `form-data`
3. Add key `file` with type `File`
4. Select audio file
5. Send request

## Performance

- **Analysis Time**: ~5-15 seconds for 1-minute audio
- **Whisper Model**: 'base' (fast, good accuracy)
- **Memory Usage**: ~500MB-1GB during analysis

## Troubleshooting

### "FFmpeg not found"

Install FFmpeg (see Installation section)

### "Module not found"

```bash
pip install -r requirements.txt
```

### Slow first run

Whisper model downloads on first use (~140MB)

## License

MIT
