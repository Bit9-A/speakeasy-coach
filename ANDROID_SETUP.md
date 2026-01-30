# 📱 Guía para Android

## 🔧 Configuración Rápida

### Problema: "Network request failed"

Cuando usas Android, `localhost`no funciona porque se refiere al dispositivo, no a tu computadora.

---

## ✅ Solución

### 1️⃣ **Encuentra tu IP local**

**Windows PowerShell:**

```powershell
ipconfig
```

Busca "Dirección IPv4" en la sección de tu Wi-Fi/Ethernet:

```
Dirección IPv4. . . . . . . . . : 192.168.2.7
```

**Mac/Linux:**

```bash
ifconfig | grep "inet "
```

O míralo en Expo Dev Tools - aparece como: `exp://192.168.2.7:8081`

---

### 2️⃣ **Actualiza la URL del API**

Ya actualicé el archivo `apiService.ts` con tu IP: **192.168.2.7**

Si tu IP es diferente, edita la línea 17 en:
[src/services/apiService.ts](file:///c:/Users/adria/.gemini/antigravity/playground/frozen-apogee/speakeasy-coach/src/services/apiService.ts#L17)

```typescript
return "http://TU_IP_AQUI:8000"; // Ejemplo: 192.168.1.100
```

---

### 3️⃣ **Asegúrate de que el backend acepte conexiones externas**

El backend ya está configurado correctamente:

```python
# main.py - CORS permite todas las conexiones
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica las IPs
    ...
)
```

Y corre en todas las interfaces:

```python
uvicorn.run("main:app", host="0.0.0.0", port=8000)
```

---

### 4️⃣ **Reinicia la app**

1. **Detén Expo** (Ctrl+C en la terminal)
2. **Reinicia**:
   ```bash
   npx expo start --clear
   ```
3. **Escanea el QR** con Expo Go en Android
4. **Prueba grabar** - ahora debería conectarse correctamente

---

## 🔍 Verificación

### Test manual de conexión:

**Desde Android:**

1. Abre el navegador en tu teléfono
2. Ve a: `http://192.168.2.7:8000`
3. Deberías ver: `{"status":"online","service":"SpeakEasy Coach API"}`

**Desde tu PC:**

```powershell
curl http://192.168.2.7:8000
```

Si ves el mensaje de status, ¡está funcionando!

---

## 📝 Para Emulador de Android Studio

Si usas el emulador en lugar de dispositivo físico:

```typescript
// En apiService.ts línea 12
return "http://10.0.2.2:8000"; // IP especial del emulador
```

---

## 🔥 Firewall de Windows

Si sigue sin conectar, verifica el firewall:

```powershell
# PowerShell como Administrador
New-NetFirewallRule -DisplayName "FastAPI Dev" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

O permite Python/uvicorn cuando Windows pregunte.

---

## ✅ Checklist

- [ ] IP local identificada (192.168.2.7)
- [ ] API URL actualizada en `apiService.ts`
- [ ] Backend corriendo (`python main.py`)
- [ ] Expo reiniciado (`npx expo start --clear`)
- [ ] Firewall permite puerto 8000
- [ ] Ambos dispositivos en la misma red Wi-Fi

---

¡Ahora debería funcionar! 🚀
