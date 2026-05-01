const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURACIÓN GOOGLE SHEETS ---
const SPREADSHEET_ID = '1vYddDhWzv8WsPAeWM4zG7LCA7cjl0SDFUlNn_N-roo0';
const CREDENTIALS = {
  client_email: "reparacionesya@reparacionesya-495022.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCkWuNQvWP0pjni\nlOcAmBNpGsQqrDIspS1bYk+U7XKkrzFdlhteTvJzMJpJSrGyCfeLUEkkWw4GTMkp\n9mLOGANS5I/6M8c5oglA8r2RLC11nNP7a+XhujCkvTxog28HkicQVBaayxRx8f5W\nh/hGBldGu/BVCQB828Qq6jCi1cylCMtyJ8QYGfkTaKCiB/wXC8AS/yMxYKbXsQe6\nqhpcuWvkRC7acxwxDYPJskn8L0W3LwxtYZv/QgpXfmbnKvKIXH3P0G9huh/jtM1r\n/YbjvTNhd2pr3SA9G7ecxiW+AvL+xlDuUdiB697IlnSkUykiZDlMGTs+cn2rdpnP\nfDTBVNZ7AgMBAAECgf9HQyFM4NF2QpzWobmHiGjiKbjkx8T5lqUT+oyHBm2u+kdt\nTKiRO6nkSC6dmMVzbN7oiOct3E04bhLLHwm4UrEeP/wtgEXht2BLyPRo/b64QEep\nvB7wwMpWo7aNmm+J2NUXP16Nv4Ad589ftZTwx88P3G1YcY7ElIV6FhEAibMx2uxM\nGHRd8qGT7u1N8VCeo/h7Hd+JXlbEE5BJKV13VDo9oL8Dg0wXHqK+D2GaFb2maq1H\nBZ19V6zKzjneBqJLRgxnQBDtYdJOBj3qyW7+ms1ohAH+VQXysYSXGNuZcomPUARl\nELt7GtzLit7VlZrFA9hD81+tgvqSvSD8PHnZQvECgYEA1pm+gn5VJ2HpL9gXq0Nu\n9P8ZAvcTb+ahYaib3QVa4gyUdSTvrdiEAbfJZws3oeD2+5lks9FdfjYTUSKsNFMn\nGuIq7HJEyBsPvp04FJbwRCqkR6C8x+f2DOP7wnKWIMfLCUdQFw8buNtOyQMYO9ie\nh2D+WPNETprnyH2h1YqeSokCgYEAxA+4PjpISGizUkIq2eh41lRGLI8T2BKyou3J\n2wdaoeXbk1QNF58SNkeoBlDBzfYk3H0K/hACJlepUC4BC+JlB2vN8TqIX2y/eQhc\n2paDmdnWyfrGXEyTS4JTu6JcXJOUeMJ+AMPoucLVIGHpMak1SXzfwI5T4HRhYPJz\n1KO3B+MCgYAq59xGHNoLoLDNpwe8byQNCb/HbvzM37CeZOacvwhXr6oy7aqZ+HMU\nINm8p2p9DAx1a0rOBOsLY+Ziz2rcn09vOY7ZbVNBKt/v/WEMBM2O43Oq+oEj+sWf\n+CkKzHwlm6yFc2OY6KVjRT2wRNUgigPQD11rDWA30xLKbAviNO/G+QKBgCyih4dj\nLWGOtIRdm/PQAPKKbQ9n41SlrRV6nSHIItIIylxYHkLqa/L/jTki2XxSNUIdFYuR\niWvBOUKPtp1GBUoTOOdaNAHFeDHNvZXl/j/gYA3Lka0hocbm/LkS1YQd9QcpABac\ngzcHLA4bPEOaCg+Y5jeoL2BCHok7qTMXsmuRAoGAQPdmrCG5cF9yiTwXq6t01PFe\nxhQ/JzHCbIxqvkci8orwnzLzn4fQzLDvpq9HvKFFXKrqY20P41gfIHoQj60GHWg6\nTlfZ5XzJmr9X1t5L5IrVgg7+OCYGWg8E0D1WUy+A9MgsJT+kgMfX4GMTz4Qo6Yil\nF3SR8zvZZi8njNh3s30=\n-----END PRIVATE KEY-----\n"
};

const serviceAccountAuth = new JWT({
  email: CREDENTIALS.client_email,
  key: CREDENTIALS.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta para recibir datos del formulario
app.post('/BACKEND/Reparacion.js', async (req, res) => {
  try {
    const datosFormulario = {
      Nombre: req.body.nombre_contacto,
      Email: req.body.email_contacto,
      Telefono: req.body.telefono_contacto,
      Dispositivo: req.body.tipo_dispositivo === 'pc' ? 'PC de Escritorio' : req.body.tipo_dispositivo === 'notebook' ? 'Notebook/Laptop' : 'Ambos',
      Problema: req.body.tipo_falla,
      Servicio: req.body.servicio_solicitado || 'No especificado',
      Fecha_Contacto: req.body.fecha_contacto,
      Fecha_Registro: new Date().toLocaleString('es-AR')
    };

    // Guardar en Google Sheets
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; 
    await sheet.addRow(datosFormulario);

    // Redirigir o responder (Tu HTML original)
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
            <p>Hola <strong>${datosFormulario.Nombre}</strong>,</p>
            <p>Gracias por confiar en <strong>ReparacionesYa!</strong> Hemos recibido tu solicitud de reparación de manera exitosa.</p>
            
            <div class="details">
              <p><strong>Teléfono registrado:</strong> ${datosFormulario.Telefono}</p>
              <p><strong>Email:</strong> ${datosFormulario.Email}</p>
              <p><strong>Dispositivo:</strong> ${datosFormulario.Dispositivo}</p>
              <p><strong>Servicio solicitado:</strong> ${datosFormulario.Servicio}</p>
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
            <p>Hubo un error al guardar el formulario en Google Sheets.</p>
            <p>${error.message}</p>
            <br>
            <a href="/">Volver al inicio</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  Servidor ReparacionesYa! activo       ║`);
  console.log(`║  Google Sheets ID: ...-roo0            ║`);
  console.log(`║  URL: http://localhost:${PORT}           ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
});