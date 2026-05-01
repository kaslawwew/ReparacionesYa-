const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ExcelManager = require('./BACKEND/ExcelManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Instanciar el gestor de Excel
const excelManager = new ExcelManager('./DATA/formularios.xlsx');

// Ruta para recibir datos del formulario
app.post('/BACKEND/Reparacion.js', async (req, res) => {
  try {
    const datosFormulario = {
      nombre: req.body.nombre_contacto,
      email: req.body.email_contacto,
      telefono: req.body.telefono_contacto,
      dispositivo: req.body.tipo_dispositivo,
      problema: req.body.tipo_falla,
      servicio: req.body.servicio_solicitado || 'No especificado',
      fechaContacto: req.body.fecha_contacto,
      fechaRegistro: new Date().toLocaleString('es-AR')
    };

    // Guardar en Excel
    await excelManager.agregarDato(datosFormulario);

    // Redirigir o responder
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Formulario Enviado! - ReparacionesYa!</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
          }
          .fondo-header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 300px;
            background-image: url('/MEDIA/trya-.png');
            background-size: cover;
            background-position: center;
            opacity: 0.3;
            z-index: 0;
          }
          .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            padding: 50px 40px;
            max-width: 600px;
            width: 100%;
            text-align: center;
            animation: slideIn 0.5s ease-out;
            position: relative;
            z-index: 1;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .header-success {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
          }
          .logo-container {
            position: relative;
            width: 150px;
            height: 150px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            border: 3px solid #4CAF50;
            animation: zoomIn 0.6s ease-out;
          }
          @keyframes zoomIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .logo img {
            width: 90%;
            height: 90%;
            object-fit: contain;
          }
          .checkmark {
            font-size: 60px;
            color: #4CAF50;
            margin-bottom: 20px;
            animation: bounce 0.6s ease-out;
            position: absolute;
            bottom: -30px;
            right: -30px;
            background: white;
            border-radius: 50%;
            width: 70px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          }
          @keyframes bounce {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
          h1 {
            color: #333;
            font-size: 32px;
            margin-bottom: 10px;
            margin-top: 30px;
            font-weight: bold;
          }
          .subtitle {
            color: #4CAF50;
            font-size: 18px;
            margin-bottom: 30px;
            font-weight: 600;
          }
          .content {
            margin: 30px 0;
            text-align: left;
            background: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #4CAF50;
          }
          .content p {
            color: #555;
            line-height: 1.8;
            margin: 10px 0;
            font-size: 16px;
          }
          .content strong {
            color: #333;
            font-weight: bold;
          }
          .details {
            background: #e8f5e9;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: center;
          }
          .details p {
            color: #2e7d32;
            margin: 8px 0;
            font-size: 14px;
          }
          .buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
          }
          .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }
          .btn-primary {
            background: #4CAF50;
            color: white;
          }
          .btn-primary:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
          }
          .btn-secondary {
            background: #2196F3;
            color: white;
          }
          .btn-secondary:hover {
            background: #0b7dda;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
          }
          .footer-note {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #999;
            font-size: 13px;
          }
          .whatsapp-btn {
            background: #25D366;
            color: white;
            padding: 12px 30px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-weight: 600;
            margin-top: 15px;
            transition: all 0.3s ease;
          }
          .whatsapp-btn:hover {
            background: #20ba58;
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="fondo-header"></div>
        <div class="container">
          <div class="header-success">
            <div class="logo-container">
              <div class="logo">
                <img src="/MEDIA/LogoReparacionesYa!.png" alt="Logo ReparacionesYa">
              </div>
              <div class="checkmark">✓</div>
            </div>
            <h1>¡Formulario Enviado!</h1>
            <p class="subtitle">Tu solicitud ha sido recibida correctamente</p>
          </div>

          <div class="content">
            <p>Hola <strong>${datosFormulario.nombre}</strong>,</p>
            <p>Gracias por confiar en <strong>ReparacionesYa!</strong> Hemos recibido tu solicitud de reparación de manera exitosa.</p>
            
            <div class="details">
              <p><strong>Teléfono registrado:</strong> ${datosFormulario.telefono}</p>
              <p><strong>Email:</strong> ${datosFormulario.email}</p>
              <p><strong>Dispositivo:</strong> ${datosFormulario.dispositivo === 'pc' ? 'PC de Escritorio' : datosFormulario.dispositivo === 'notebook' ? 'Notebook/Laptop' : 'Ambos'}</p>
              <p><strong>Servicio solicitado:</strong> ${datosFormulario.servicio}</p>
            </div>

            <p>Nuestro equipo de técnicos especializados revisará tu solicitud y <strong>nos contactaremos contigo pronto</strong> para confirmar la cita y resolver tu problema.</p>
            
            <p><strong>Tiempo de respuesta:</strong> Entre 1-2 horas hábiles (Horarios Rotativos por la semana), Finde semana mas rapido</p>
          </div>

          <div class="buttons">
            <a href="/" class="btn btn-primary">← Volver al Inicio</a>
            <a href="https://wa.me/543764101265?text=Hola%20ReparacionesYa!%20Tengo%20una%20solicitud%20de%20reparación" class="btn btn-secondary">💬 Contactar por WhatsApp</a>
          </div>

          <div class="footer-note">
            <p>Si tienes dudas, puedes visitarnos en: Padre Serrano 3170, Posadas-Misiones</p>
            <p>Horario de atención: 8:00 - 12:00 hs | 15:00 - 19:00 hs (Lunes a Viernes)</p>
          </div>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Error al guardar el formulario:', error);
    res.status(500).send(`
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f0f0; }
            .error { background: #f44336; color: white; padding: 20px; border-radius: 5px; max-width: 400px; margin: auto; }
            a { color: #f44336; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="error">
            <h2>✗ Error</h2>
            <p>Hubo un error al guardar el formulario.</p>
            <p>${error.message}</p>
            <br>
            <a href="/">Volver al inicio</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Ruta para obtener todos los datos (opcional, para visualizar)
app.get('/api/formularios', async (req, res) => {
  try {
    const datos = await excelManager.obtenerDatos();
    res.json({
      success: true,
      cantidad: datos.length,
      datos: datos
    });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos: ' + error.message
    });
  }
});

// Ruta para descargar el Excel
app.get('/api/descargar-excel', async (req, res) => {
  try {
    const filePath = './DATA/formularios.xlsx';
    res.download(filePath, 'formularios_reparacion.xlsx');
  } catch (error) {
    console.error('Error al descargar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al descargar: ' + error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  Servidor activo en: http://localhost:${PORT}`);
  console.log(`║  Excel guardado en: ./DATA/formularios.xlsx`);
  console.log(`╚════════════════════════════════════════╝\n`);
});
