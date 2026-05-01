const ExcelManager = require('../lib/ExcelManager');

const excelManager = new ExcelManager('/tmp/formularios.xlsx');

const htmlExito = (datos) => `
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
    .checkmark {
      font-size: 60px;
      color: #4CAF50;
      margin-bottom: 20px;
      animation: bounce 0.6s ease-out;
    }
    @keyframes bounce {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    h1 {
      color: #333;
      font-size: 32px;
      margin-bottom: 10px;
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
    }
    .btn-secondary {
      background: #2196F3;
      color: white;
    }
    .btn-secondary:hover {
      background: #0b7dda;
      transform: translateY(-2px);
    }
    .footer-note {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #999;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-success">
      <div class="checkmark">✓</div>
      <h1>¡Formulario Enviado!</h1>
      <p class="subtitle">Tu solicitud ha sido recibida correctamente</p>
    </div>

    <div class="content">
      <p>Hola <strong>${datos.nombre}</strong>,</p>
      <p>Gracias por confiar en <strong>ReparacionesYa!</strong> Hemos recibido tu solicitud.</p>
      
      <div class="details">
        <p><strong>Teléfono:</strong> ${datos.telefono}</p>
        <p><strong>Email:</strong> ${datos.email}</p>
        <p><strong>Dispositivo:</strong> ${datos.dispositivo === 'pc' ? 'PC de Escritorio' : datos.dispositivo === 'notebook' ? 'Notebook/Laptop' : 'Ambos'}</p>
        <p><strong>Servicio:</strong> ${datos.servicio}</p>
      </div>

      <p>Nuestro equipo se contactará contigo pronto.</p>
    </div>

    <div class="buttons">
      <a href="/" class="btn btn-primary">← Volver al Inicio</a>
    </div>

    <div class="footer-note">
      <p>Padre Serrano 3170, Posadas-Misiones</p>
    </div>
  </div>
</body>
</html>
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    let body = req.body;
    
    // Si el body es un string, parsearlo como JSON
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { nombre_contacto, email_contacto, telefono_contacto, tipo_dispositivo, tipo_falla, fecha_contacto, servicio_solicitado } = body;

    const datosFormulario = {
      nombre: nombre_contacto || 'Sin nombre',
      email: email_contacto || 'Sin email',
      telefono: telefono_contacto || 'Sin teléfono',
      dispositivo: tipo_dispositivo || 'No especificado',
      problema: tipo_falla || 'No especificado',
      servicio: servicio_solicitado || 'No especificado',
      fechaContacto: fecha_contacto || 'No especificada',
      fechaRegistro: new Date().toLocaleString('es-AR')
    };

    // Guardar en Excel
    await excelManager.agregarDato(datosFormulario);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(htmlExito(datosFormulario));

  } catch (error) {
    console.error('Error:', error.message);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .container { background: white; padding: 30px; border-radius: 10px; max-width: 400px; margin: auto; }
          .error { color: #f44336; }
          a { color: #2196F3; text-decoration: none; font-weight: bold; margin-top: 20px; display: block; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="error">✗ Error</h2>
          <p>Hubo un error al procesar tu solicitud.</p>
          <a href="/">← Volver al Inicio</a>
        </div>
      </body>
      </html>
    `);
  }
}
