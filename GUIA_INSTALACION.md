% GUÍA DE INSTALACIÓN Y CONFIGURACIÓN
% Sistema de Guardado de Formularios en Excel

# 📋 Sistema de Guardado de Formularios en Excel

## 🚀 Instalación Rápida

### Paso 1: Instalar Node.js
Descarga e instala **Node.js** desde: https://nodejs.org/ (versión LTS recomendada)

### Paso 2: Instalar dependencias
Abre terminal/CMD en tu carpeta `PROYECTOREPARACION` y ejecuta:

```bash
npm install
```

Esto instalará:
- **Express**: Servidor web
- **ExcelJS**: Librería para manejar archivos Excel
- **Body-parser**: Para procesar datos del formulario
- **CORS**: Para permitir solicitudes cross-origin

### Paso 3: Iniciar el servidor
En la misma terminal, ejecuta:

```bash
npm start
```

Deberías ver:
```
╔════════════════════════════════════════╗
║  Servidor activo en: http://localhost:3000
║  Excel guardado en: ./DATA/formularios.xlsx
╚════════════════════════════════════════╝
```

### Paso 4: Acceder a tu sitio
Abre en el navegador: **http://localhost:3000**

---

## 📊 Características Implementadas

### ✅ Auto-captura de Servicios
- Cuando un usuario hace clic en **"Solicitar Ahora"** en cualquier servicio o promo:
  1. Se captura automáticamente el nombre del servicio
  2. Se auto-completa el campo "Servicio de Interés"
  3. La página desplaza suavemente al formulario
  4. El cursor se enfoca en el campo de nombre

### ✅ Guardado en Excel en Vivo
- Cada formulario se guarda automáticamente en `DATA/formularios.xlsx`
- El archivo se actualiza en tiempo real
- Se incluyen campos:
  - Nombre del contacto
  - Email
  - Teléfono
  - Dispositivo
  - Descripción del problema
  - Servicio solicitado
  - Fecha preferida de contacto
  - Fecha y hora de registro

### ✅ Formato Profesional
- Encabezados con colores
- Bordes en todas las celdas
- Texto ajustado automáticamente
- Numeración automática de registros

---

## 🔧 Estructura de Archivos

```
PROYECTOREPARACION/
├── server.js                    # Servidor Express
├── package.json                 # Dependencias
├── index.html                   # Página principal
├── js/
│   └── servicios.js            # Script para capturar servicios
├── BACKEND/
│   ├── Reparacion.js           # Ruta POST del formulario
│   └── ExcelManager.js         # Gestor de Excel
├── DATA/
│   └── formularios.xlsx        # Base de datos Excel (se crea automáticamente)
└── ... (otros archivos)
```

---

## 📡 Rutas API Disponibles

### POST `/BACKEND/Reparacion.js`
Guarda un nuevo formulario en Excel
```javascript
Body (formulario):
{
  nombre_contacto: "Juan Pérez",
  email_contacto: "juan@email.com",
  telefono_contacto: "+54 123-456-7890",
  tipo_dispositivo: "notebook",
  tipo_falla: "No arranca la PC",
  fecha_contacto: "2026-05-10",
  servicio_solicitado: "Diagnóstico y Asesoramiento"
}

Response:
{
  success: true,
  message: "Formulario guardado exitosamente"
}
```

### GET `/api/formularios`
Obtiene todos los registros (JSON)
```
Response:
{
  success: true,
  datos: [
    [1, "Juan Pérez", "juan@email.com", ...]
  ]
}
```

### GET `/api/descargar-excel`
Descarga el archivo Excel completo

---

## 🐛 Solución de Problemas

### "No se encuentra Node.js"
→ Reinicia la terminal después de instalar Node.js

### "Puerto 3000 en uso"
→ Abre terminal y ejecuta:
```bash
netstat -ano | findstr :3000  # Windows
# O usa otro puerto: PORT=3001 npm start
```

### El Excel no se crea
→ Verifica permisos de escritura en la carpeta del proyecto

### Los botones de servicio no funcionan
→ Asegúrate de que `js/servicios.js` está en la carpeta correcta
→ Abre consola (F12) y verifica si hay errores

---

## 🎯 Próximas Mejoras (Opcional)

- [ ] Agregar autenticación de usuarios
- [ ] Filtros y búsqueda en Excel
- [ ] Dashboard de estadísticas
- [ ] Envío de confirmación por email
- [ ] WhatsApp integration

---

## 📞 Soporte

Si encuentras problemas, verifica:
1. Que Node.js esté instalado: `node --version`
2. Que npm instaló las dependencias: `npm list`
3. Que el servidor esté corriendo: terminal mostrando el mensaje de inicio
4. Que accedes a `http://localhost:3000` (no `file://`)

**¡Listo! Tu sistema de formularios con Excel está funcionando.** 🎉
