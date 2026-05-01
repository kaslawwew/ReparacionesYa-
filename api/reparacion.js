const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async (req, res) => {
  // Manejar solo solicitudes POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  // --- CONFIGURACIÓN DE GOOGLE ---
  const SPREADSHEET_ID = '1vYddDhWzv8WsPAeWM4zG7LCA7cjl0SDFUlNn_N-roo0';
  const CLIENT_EMAIL = "reparacionesya@reparacionesya-495022.iam.gserviceaccount.com";
  
  // La clave privada debe manejar correctamente los saltos de línea \n
// Dentro de api/reparacion.js
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n..." // (tu clave larga)
  .replace(/\\n/g, '\n'); // Esto asegura que los saltos de línea sean válidos

  const serviceAccountAuth = new JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

  try {
    // Vercel parsea automáticamente el body si es JSON o URL Encoded
    const { 
      nombre_contacto, 
      email_contacto, 
      telefono_contacto, 
      tipo_dispositivo, 
      tipo_falla, 
      servicio_solicitado, 
      fecha_contacto 
    } = req.body;

    const datosFormulario = {
      Nombre: nombre_contacto || 'N/A',
      Email: email_contacto || 'N/A',
      Telefono: telefono_contacto || 'N/A',
      Dispositivo: tipo_dispositivo || 'N/A',
      Problema: tipo_falla || 'N/A',
      Servicio: servicio_solicitado || 'No especificado',
      Fecha_Contacto: fecha_contacto || 'No especificada',
      Fecha_Registro: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    };

    // 1. Cargar info del documento
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // 2. Añadir la fila
    await sheet.addRow(datosFormulario);

    // 3. Respuesta HTML de éxito (El diseño que ya tenías)
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Formulario Enviado! - ReparacionesYa!</title>
        <style>
          body { font-family: sans-serif; background: #764ba2; display: flex; justify-content: center; align-items: center; height: 100vh; color: white; margin: 0; }
          .card { background: white; color: #333; padding: 40px; border-radius: 15px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 500px; }
          .btn { background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
          h1 { color: #4CAF50; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>¡Formulario Recibido!</h1>
          <p>Gracias <strong>${datosFormulario.Nombre}</strong>. Ya guardamos tu solicitud en nuestra base de datos.</p>
          <p>Nos comunicaremos al teléfono: ${datosFormulario.Telefono}</p>
          <a href="/" class="btn">Volver al Sitio</a>
        </div>
      </body>
      </html>
    `);

} catch (error) {
    console.error('DETALLE DEL ERROR:', error); // Esto lo verás en los logs de Vercel
    return res.status(500).json({ 
      error: 'Error interno al guardar', 
      message: error.message,
      stack: error.stack // Esto nos dará más pistas del "undefined"
    });
  }
};