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

// 1. Pegamos la clave en una sola línea quitando los saltos manuales
const keyFromSecret = `-----BEGIN PRIVATE KEY-----
MIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCkWuNQvWP0pjni
lOcAmBNpGsQqrDIspS1bYk+U7XKkrzFdlhteTvJzMJpJSrGyCfeLUEkkWw4GTMkp
9mLOGANS5I/6M8c5oglA8r2RLC11nNP7a+XhujCkvTxog28HkicQVBaayxRx8f5W
h/hGBldGu/BVCQB828Qq6jCi1cylCMtyJ8QYGfkTaKCiB/wXC8AS/yMxYKbXsQe6
qhpcuWvkRC7acxwxDYPJskn8L0W3LwxtYZv/QgpXfmbnKvKIXH3P0G9huh/jtM1r
/YbjvTNhd2pr3SA9G7ecxiW+AvL+xlDuUdiB697IlnSkUykiZDlMGTs+cn2rdpnP
fDTBVNZ7AgMBAAECgf9HQyFM4NF2QpzWobmHiGjiKbjkx8T5lqUT+oyHBm2u+kdt
nTKiRO6nkSC6dmMVzbN7oiOct3E04bhLLHwm4UrEeP/wtgEXht2BLyPRo/b64QEep
vB7wwMpWo7aNmm+J2NUXP16Nv4Ad589ftZTwx88P3G1YcY7ElIV6FhEAibMx2uxM
GHRd8qGT7u1N8VCeo/h7Hd+JXlbEE5BJKV13VDo9oL8Dg0wXHqK+D2GaFb2maq1H
BZ19V6zKzjneBqJLRgxnQBDtYdJOBj3qyW7+ms1ohAH+VQXysYSXGNuZcomPUARl
ELt7GtzLit7VlZrFA9hD81+tgvqSvSD8PHnZQvECgYEA1pm+gn5VJ2HpL9gXq0Nu
9P8ZAvcTb+ahYaib3QVa4gyUdSTvrdiEAbfJZws3oeD2+5lks9FdfjYTUSKsNFMn
GuIq7HJEyBsPvp04FJbwRCqkR6C8x+f2DOP7wnKWIMfLCUdQFw8buNtOyQMYO9ie
h2D+WPNETprnyH2h1YqeSokCgYEAxA+4PjpISGizUkIq2eh41lRGLI8T2BKyou3J
2wdaoeXbk1QNF58SNkeoBlDBzfYk3H0K/hACJlepUC4BC+JlB2vN8TqIX2y/eQhc
2paDmdnWyfrGXEyTS4JTu6JcXJOUeMJ+AMPoucLVIGHpMak1SXzfwI5T4HRhYPJz
1KO3B+MCgYAq59xGHNoLoLDNpwe8byQNCb/HbvzM37CeZOacvwhXr6oy7aqZ+HMU
INm8p2p9DAx1a0rOBOsLY+Ziz2rcn09vOY7ZbVNBKt/v/WEMBM2O43Oq+oEj+sWf
+CkKzHwlm6yFc2OY6KVjRT2wRNUgigPQD11rDWA30xLKbAviNO/G+QKBgCyih4dj
LWGOtIRdm/PQAPKKbQ9n41SlrRV6nSHIItIIylxYHkLqa/L/jTki2XxSNUIdFYuR
iWvBOUKPtp1GBUoTOOdaNAHFeDHNvZXl/j/gYA3Lka0hocbm/LkS1YQd9QcpABac
gzcHLA4bPEOaCg+Y5jeoL2BCHok7qTMXsmuRAoGAQPdmrCG5cF9yiTwXq6t01PFe
xhQ/JzHCbIxqvkci8orwnzLzn4fQzLDvpq9HvKFFXKrqY20P41gfIHoQj60GHWg6
TlfZ5XzJmr9X1t5L5IrVgg7+OCYGWg8E0D1WUy+A9MgsJT+kgMfX4GMTz4Qo6Yil
F3SR8zvZZi8njNh3s30=
-----END PRIVATE KEY-----`;

// 2. LIMPIEZA EXTREMA: Quitamos espacios raros y normalizamos saltos de línea
const PRIVATE_KEY = keyFromSecret
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .join('\n')
  const serviceAccountAuth = new JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

  try {
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

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow(datosFormulario);

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
          <h1>¡CONTROL_V3!</h1>
          <p>Hola <strong>${datosFormulario.Nombre}</strong>. Los datos se guardaron correctamente.</p>
          <a href="/" class="btn">Volver al Sitio</a>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('ERROR DETALLADO:', error);
    return res.status(500).json({ 
      error: 'Error al guardar en Google Sheets', 
      message: error.message,
      stack: error.stack
    });
  }
};