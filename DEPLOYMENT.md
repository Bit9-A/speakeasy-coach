# 🚀 Guía de Deployment a Producción

## 🎯 Resumen

Esta guía cubre cómo desplegar SpeakEasy Coach en producción, incluyendo:

- **Frontend**: React Native web + aplicaciones móviles
- **Backend**: FastAPI con servicios de IA
- **Infraestructura**: Servidores, base de datos, storage

---

## 📦 Opción 1: Deployment Web (Más Simple)

### Frontend - Vercel / Netlify

**Vercel es ideal para apps Expo web:**

```bash
# 1. Build for web
npx expo export:web

# 2. Deploy a Vercel
npm i -g vercel
vercel --prod
```

**Configuración** (`vercel.json`):

```json
{
  "buildCommand": "npx expo export:web",
  "outputDirectory": "web-build",
  "framework": null,
  "env": {
    "EXPO_PUBLIC_API_URL": "https://your-backend.com"
  }
}
```

---

### Backend - Railway / Render / Fly.io

#### Opción A: Railway (Recommendado - Gratis para empezar)

1. **Crear `railway.yml`**:

```yaml
build:
  builder: DOCKERFILE
  dockerfilePath: Dockerfile

deploy:
  startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
  healthcheckPath: /
  healthcheckTimeout: 100
```

2. **Crear `Dockerfile`**:

```dockerfile
FROM python:3.11-slim

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose port
EXPOSE 8000

# Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

3. **Actualizar `requirements.txt`**:

```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
python-multipart==0.0.12
librosa>=0.10.0
numpy>=1.24.0
scipy>=1.11.0
openai-whisper
pydantic==2.9.2
python-dotenv==1.0.1
aiofiles==24.1.0
soundfile
```

4. **Deploy**:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

#### Opción B: Render

1. Conecta tu repositorio GitHub
2. Configura:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Variables de entorno:
   - `PYTHON_VERSION`: `3.11`
   - `FFMPEG_PATH`: `/usr/bin/ffmpeg` (preinstalado en Render)

---

## 📱 Opción 2: Aplicaciones Móviles (iOS + Android)

### Expo Application Services (EAS)

**1. Configurar EAS:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure
```

**2. Crear `eas.json`**:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://your-backend.railway.app"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./path/to/api-key.json"
      },
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      }
    }
  }
}
```

**3. Build para Android**:

```bash
eas build --platform android --profile production
```

**4. Build para iOS** (requiere cuenta Apple Developer $99/año):

```bash
eas build --platform ios --profile production
```

**5. Submit a las tiendas**:

```bash
# Google Play Store
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

---

## 🗄️ Base de Datos (Opcional - Para guardar histórico)

### Opción A: Supabase (PostgreSQL Gratis)

```bash
# 1. Crear proyecto en supabase.com

# 2. Agregar variable de entorno
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
```

**Schema SQL**:

```sql
CREATE TABLE recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    audio_url TEXT,
    duration FLOAT,
    analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_recordings ON recordings(user_id, created_at DESC);
```

### Opción B: MongoDB Atlas (NoSQL Gratis)

```python
# backend/database.py
from motor.motor_asyncio import AsyncIOMotorClient

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    return db.client.speakeasy
```

---

## 🔐 Variables de Entorno

### Frontend (`.env.production`):

```bash
EXPO_PUBLIC_API_URL=https://speakeasy-api.railway.app
EXPO_PUBLIC_ENVIRONMENT=production
```

### Backend (`.env.production`):

```bash
# API Settings
ENVIRONMENT=production
CORS_ORIGINS=https://speakeasy-coach.vercel.app,https://www.speakeasy.app

# Database (opcional)
DATABASE_URL=postgresql://...

# Storage (opcional, para guardar audios)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=speakeasy-recordings
AWS_REGION=us-east-1

# Limits
MAX_FILE_SIZE_MB=50
MAX_DURATION_MINUTES=10
```

---

## ⚡ Optimizaciones de Producción

### 1. CDN para Assets Estáticos

```javascript
// app.json
{
  "expo": {
    "assetBundlePatterns": ["assets/**/*"],
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 2. Caching de Modelos Whisper

```python
# backend/main.py
import whisper
import os

# Cache en startup
WHISPER_MODEL = None

@app.on_event("startup")
async def load_model():
    global WHISPER_MODEL
    cache_dir = os.getenv("WHISPER_CACHE_DIR", "/tmp/whisper")
    os.makedirs(cache_dir, exist_ok=True)
    WHISPER_MODEL = whisper.load_model("base", download_root=cache_dir)
    print("✅ Whisper model loaded")
```

### 3. Rate Limiting

```python
from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.post("/api/analyze")
@limiter.limit("10/hour")  # 10 análisis por hora por IP
async def analyze(...):
    pass
```

### 4. Compresión de Respuestas

```python
from fastapi.middleware.gzip import GZIPMiddleware

app.add_middleware(GZIPMiddleware, minimum_size=1000)
```

---

## 📊 Monitoreo

### Sentry (Errores en Producción)

```bash
# Install
npm install @sentry/react-native

# Configure frontend
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://your-dsn@sentry.io/project",
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
});
```

```python
# Backend
pip install sentry-sdk[fastapi]

import sentry_sdk

sentry_sdk.init(
    dsn="https://your-dsn@sentry.io/project",
    traces_sample_rate=0.1,
)
```

---

## 💰 Costos Estimados

### Opción Gratuita (para empezar):

- **Frontend**: Vercel Free (100GB bandwidth/mes)
- **Backend**: Railway Free ($5 crédito/mes)
- **Base de datos**: Supabase Free (500MB)
- **Total**: $0/mes (límites gratuitos)

### Opción Escalable (1000 usuarios/mes):

- **Frontend**: Vercel Pro ($20/mes)
- **Backend**: Railway Hobby ($5/mes) o Render ($7/mes)
- **Base de datos**: Supabase Pro ($25/mes)
- **Storage**: S3 ($1-5/mes)
- **Total**: ~$35-57/mes

---

## ✅ Checklist Pre-Deployment

- [ ] **Frontend**:
  - [ ] Variables de entorno configuradas
  - [ ] API URL apunta a backend de producción
  - [ ] Assets optimizados (imágenes comprimidas)
  - [ ] Error boundaries implementados
- [ ] **Backend**:
  - [ ] FFmpeg instalado en Docker/servidor
  - [ ] Whisper model se descarga en startup
  - [ ] Rate limiting activado
  - [ ] CORS configurado correctamente
  - [ ] Logs configurados (no prints)
- [ ] **Seguridad**:
  - [ ] HTTPS habilitado (Vercel/Railway lo hacen automático)
  - [ ] Validación de input
  - [ ] Límites de tamaño de archivo
  - [ ] Headers de seguridad (HSTS, CSP)

- [ ] **Monitoreo**:
  - [ ] Sentry configurado
  - [ ] Health checks funcionando
  - [ ] Alertas de errores

---

## 🚀 Comando de Deploy Completo

```bash
#!/bin/bash

echo "🚀 Deploying SpeakEasy Coach..."

# 1. Deploy Backend
cd backend
railway up
BACKEND_URL=$(railway status --json | jq -r '.url')

# 2. Update Frontend ENV
cd ../
echo "EXPO_PUBLIC_API_URL=$BACKEND_URL" > .env.production

# 3. Deploy Frontend
vercel --prod

# 4. Test
curl $BACKEND_URL
curl $(vercel --prod 2>&1 | grep "https" | awk '{print $2}')

echo "✅ Deployment complete!"
```

---

## 📝 Troubleshooting Común

### "ModuleNotFoundError: No module named 'whisper'"

- Asegúrate de que `openai-whisper` está en `requirements.txt`
- En Docker, verifica que `pip install` se ejecutó correctamente

### "FFmpeg not found"

- **Railway**: Agregar `RUN apt-get install -y ffmpeg` en Dockerfile
- **Render**: FFmpeg está preinstalado
- **Vercel**: No puedes correr FFmpeg en el edge, usa Railway/Render para backend

### "Audio file too large"

- Configurar límite en Nginx/Railway:

```python
app.add_middleware(
    CORSMiddleware,
    max_request_size=50 * 1024 * 1024  # 50MB
)
```

---

¿Quieres que profundice en alguna plataforma específica o necesitas ayuda con el deployment? 🚀
