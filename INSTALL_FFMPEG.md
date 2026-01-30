# 🎵 Instalación de FFmpeg para Windows

FFmpeg es necesario para que Librosa pueda procesar archivos WebM (el formato que usa el navegador para grabar audio).

## ⚡ Instalación Rápida (5 minutos)

### Paso 1: Descargar FFmpeg

1. Ve a: https://www.gyan.dev/ffmpeg/builds/
2. Descarga: **ffmpeg-release-essentials.zip** (build esencial, ~80MB)
   - O usa este link directo: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z

### Paso 2: Extraer Archivos

1. Extrae el archivo ZIP descargado
2. Verás una carpeta como `ffmpeg-7.x.x-essentials_build`
3. Renómbrala a solo `ffmpeg`
4. Muévela a `C:\ffmpeg` (crear la carpeta si no existe)

Estructura final:

```
C:\ffmpeg\
  ├── bin\
  │   ├── ffmpeg.exe  ← Este es el importante
  │   ├── ffplay.exe
  │   └── ffprobe.exe
  ├── doc\
  └── presets\
```

### Paso 3: Agregar al PATH

#### Opción A: PowerShell (Recomendado - Automático)

Copia y pega en PowerShell como **Administrador**:

```powershell
# Agregar FFmpeg al PATH del sistema
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\ffmpeg\bin",
    "Machine"
)

Write-Host "✅ FFmpeg agregado al PATH. Reinicia la terminal." -ForegroundColor Green
```

#### Opción B: Manual (GUI)

1. Presiona `Win + X` → **Sistema**
2. Click en **Configuración avanzada del sistema**
3. **Variables de entorno**
4. En **Variables del sistema**, encuentra `Path`
5. Click **Editar**
6. Click **Nuevo**
7. Agrega: `C:\ffmpeg\bin`
8. Click **Aceptar** en todas las ventanas

### Paso 4: Verificar Instalación

**Importante**: Cierra y abre una **nueva terminal** PowerShell

```powershell
ffmpeg -version
```

Deberías ver algo como:

```
ffmpeg version 7.x.x-essentials_build...
configuration: --enable-gpl --enable-version3...
```

---

## 🔧 Después de Instalar

1. **Cierra la terminal del backend** (Ctrl+C en la terminal donde corre `python main.py`)
2. **Reabre PowerShell**
3. **Reinicia el backend**:

   ```powershell
   cd c:\Users\adria\.gemini\antigravity\playground\frozen-apogee\speakeasy-coach\backend
   python main.py
   ```

4. **Recarga la página del navegador** (Ctrl+R)

---

## 🧪 Probar la Aplicación

1. 🎤 Graba un discurso (30+ segundos)
2. ⏹️ Detén la grabación
3. ⏳ Espera el análisis

**Primera vez**:

- Whisper descargará modelo (~140MB) → ~30-60s
- Los análisis posteriores serán rápidos (~5-15s)

---

## ❓ Solución de Problemas

### Error: "ffmpeg no se reconoce..."

- Verifica que `C:\ffmpeg\bin\ffmpeg.exe` existe
- Asegúrate de haber **cerrado y reabierto** la terminal después de agregar al PATH
- Reinicia la computadora si el problema persiste

### Error: "Format not recognised" (persiste)

- Verifica que FFmpeg esté en PATH: `ffmpeg -version`
- Asegúrate de que el backend se reinició **después** de instalar FFmpeg
- Revisa que el archivo se guardó como `.webm`

---

## 📦 Alternativa: Chocolatey (Si lo tienes instalado)

```powershell
choco install ffmpeg
```

Luego reinicia la terminal.

---

**Una vez instalado FFmpeg, la aplicación funcionará completamente** 🚀
