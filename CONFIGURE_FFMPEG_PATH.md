# ✅ FFmpeg ya está instalado - Solo agregar al PATH

FFmpeg está en: `C:\ffmpeg\bin\ffmpeg.exe` ✅

Solo falta agregarlo al PATH. Aquí te muestro el método más fácil:

## 🎯 Método 1: Variables de Entorno (GUI) - Recomendado

1. **Presiona** `Win + R`
2. **Escribe**: `sysdm.cpl` y presiona Enter
3. Ve a la pestaña **"Opciones avanzadas"**
4. Click en **"Variables de entorno"**
5. En la sección **"Variables del usuario para [tu usuario]"** (sección superior):
   - Busca la variable llamada `Path`
   - Si existe, selecciónala y click **"Editar"**
   - Si NO existe, click **"Nueva"**
6. Click en **"Nuevo"**
7. Agrega esta línea: `C:\ffmpeg\bin`
8. Click **Aceptar** en todas las ventanas

## 🎯 Método 2: PowerShell (Usuario, no requiere Admin)

```powershell
# Obtener PATH actual del usuario
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Agregar FFmpeg
$newPath = $currentPath + ";C:\ffmpeg\bin"

# Guardar (solo para el usuario actual, no requiere admin)
[Environment]::SetEnvironmentVariable("Path", $newPath, "User")

Write-Host "✅ FFmpeg agregado al PATH del usuario" -ForegroundColor Green
```

## ✅ Verificar que Funcionó

**Cierra y abre nueva terminal PowerShell**, luego ejecuta:

```powershell
ffmpeg -version
```

Deberías ver:

```
ffmpeg version X.X.X...
```

## 🚀 Después de Configurar PATH

1. **Cierra** la terminal donde corre el backend (Ctrl+C)
2. **Abre nueva terminal** PowerShell
3. **Reinicia el backend**:
   ```powershell
   cd c:\Users\adria\.gemini\antigravity\playground\frozen-apogee\speakeasy-coach\backend
   python main.py
   ```
4. **Recarga la página** del navegador (Ctrl+R)
5. **Graba y prueba** 🎤

---

## 🆘 Si Nada Funciona

Puedes usar FFmpeg directamente sin PATH modificando el backend:

En `backend/main.py`, antes de `librosa.load()`, agrega:

```python
import os
os.environ['PATH'] = r'C:\ffmpeg\bin' + os.pathsep + os.environ['PATH']
```

Pero es mejor agregarlo al PATH del sistema.
