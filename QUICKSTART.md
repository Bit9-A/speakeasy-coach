# SpeakEasy Coach - Guía de Instalación Rápida

## ✅ Estado: Backend Funcionando

El backend está corriendo en: **http://localhost:8000**

---

## 📋 Resumen de Instalación Completada

### Dependencias Instaladas

✅ **Python Packages**:

- FastAPI 0.128.0
- Uvicorn (con websockets)
- Librosa (análisis de audio)
- NumPy + SciPy (computación científica)
- Whisper (transcripción)
- Pydantic (validación)

✅ **Node Packages**:

- Expo SDK 54
- React Native
- expo-av (grabación de audio)
- Zustand (state management)
- react-native-skia (visualización)

---

## 🚀 Cómo Ejecutar la Aplicación

### Opción 1: Dos Terminales (Recomendado)

**Terminal 1 - Backend**:

```bash
cd backend
python main.py
```

✅ Servidor en: http://localhost:8000

**Terminal 2 - Frontend**:

```bash
# Desde la raíz del proyecto
npm start
# Presiona 'w' para web
```

### Opción 2: Modo Desarrollo

Si el backend ya está corriendo, solo ejecuta:

```bash
npm start
```

---

## 🧪 Probar la Aplicación

### 1. Verificar Backend

Abre en navegador: http://localhost:8000

Deberías ver:

```json
{
  "status": "online",
  "service": "SpeakEasy Coach API",
  "version": "1.0.0"
}
```

### 2. Ver Documentación API

Abre: http://localhost:8000/docs

Verás la interfaz interactiva de FastAPI con todos los endpoints.

### 3. Probar la App Móvil

1. Ejecuta `npm start`
2. Presiona 'w' para abrir en navegador
3. Toca el botón púrpura para grabar
4. Habla por 30+ segundos
5. Toca nuevamente para detener
6. La app enviará el audio al backend automáticamente
7. Verás los resultados del análisis

---

## ⚠️ Solución de Problemas

### Backend no inicia

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solución**:

```bash
cd backend
python -m pip install -r requirements.txt
```

### Frontend no conecta con Backend

**Error**: "Cannot connect to backend"

**Verificar**:

1. Backend está corriendo: http://localhost:8000
2. No hay firewall bloqueando el puerto 8000
3. Revisa la consola del navegador para errores CORS

### CORS Error en Navegador

**Solución**: Abre en modo incógnito o desactiva extensiones del navegador

---

## 📊 Endpoints Disponibles

### `GET /`

Health check del servidor

### `POST /api/analyze`

Analiza un archivo de audio

**Parámetros**:

- `file`: Archivo de audio (m4a, wav, mp3)

**Respuesta**:

- Scores (confianza, claridad, ritmo, nerviosismo)
- Timeline markers
- Filler words detectadas
- Métricas de prosodia
- Recomendaciones
- Transcripción

---

## 🎯 Próximos Pasos

1. ✅ Backend funcionando
2. ✅ Frontend funcionando
3. ⏳ Grabar un discurso de prueba
4. ⏳ Ver análisis completo
5. ⏳ Explorar timeline markers interactivos

---

## 📝 Notas Importantes

- **Primera ejecución**: Whisper descargará el modelo (~140MB)
- **Análisis**: Toma 5-10 segundos por minuto de audio
- **Idioma**: Configurado para español por defecto
- **Calidad**: Audio grabado a 44.1kHz para mejor análisis

---

¡Listo para usar! 🎉
