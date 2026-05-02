const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  const SPREADSHEET_ID = '1vYddDhWzv8WsPAeWM4zG7LCA7cjl0SDFUlNn_N-roo0';
  const CLIENT_EMAIL = "reparacionesya@reparacionesya-495022.iam.gserviceaccount.com";

  // CLAVE EN BASE64: Esto evita errores de caracteres invisibles o saltos de línea.
  const b64Key = "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV1Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktRd2dnU2dBZ0VBQW9JQkFRQ2tXdU5RdldQMHBqbmkKbE9jQW1CTnBHc1FxckRJc3BTMWJZaytVN1hLa3J6RmRsaHRlVnZKek1wSlNKckd5Q2ZlTFVFa2tXdzRHVE1rcAo5bUxPR0FOUzVJLzZNOY2NWm9nbEE4cjJETEMxMW5OUDdhK1hodmpDa3ZUeG9nMjhIa2ljUVZCYWF5eFJ4OGY1VwpoL2hHQmxkR3UvQlZDUUI4MjhRcU6qQ2kxY3lsQ010eUo4UVlHZmtUYUtDaUIvd1hDjhBUy95TXhZS2JYY1FlNgpxaHBjdVd2a1JDN2FjeHd4RFlQSnNrbjhMMFczTHd4dFladi9RZ3BYZm1iblN2S0lYSDNQMkc5aHVoL2p0TTFyCi9ZYmp2VE5oZDJwcjNTQTlHN2VjeGlXK0F2TCt4bER1VWRpQjY5N0lsblNrVXlraVpEbE1HVHMra24ycmRwblAKZkRUQlZOWjdBZ01CQUFFQ2dmOUhReUZNNE5GMlFweldvYm1IaEdqaUtiamt4OFQ1bHFVVCtveUhCbTJ1K2tkdApUS2lSTzZua1NDNmRtTVZ6Yk43b2lPY3QzRTA0YmhMTEh3bTRVckVlUC93dGdFWEh0MkJMeVBSb28vYjY0UUVlcAp2Qjd3d01wV283YU5tbStKMk5VWFAsNk52NEFkNTg5ZnRaVHd4ODhQM0cxWWNZN0VsSVY2RmhFQWliTXgydXhNCkdIUmQ4cUdUN3UxTjhWQ2VvL2g3SGRrSlxiRUU1QkpLVjEzVkRvOW9MOERnMHdYSXFLK0QyR2FGYjJtYXExSArQloxOVY2S3p6bmVCcUpMUnZ4blFCRHRZZEpPQmoweXlXNytrbXhvaEIrVlFYeXNZWFdHTnVab21QVUFSbApFTHQ3R3R6TGl0N1ZsWnJGQTloRDgxK3RndnFTdlNEOFBIblpRdkVDZ1lFQTFwbStnbjVWSjJIc0w5Z1hxME51CjlQOFpBdmNUYithaFlpYjNRVmE0Z3lVZFNUdnJkaUVBYmZKWndzM29lRDIrNWxrczlGZGZqWVRVU0tzTkZNbgpHdUlyN0hKRXlCc1B2cDA0Rkpid1JDcWtSNkM4eCtmMkRPUDd3bktXSU1mTENVZFFGdzhidU50T3lRTVlPOWllCmgyRCtXUE5FVHBybnlIMmhkMVlxZVNva0NnWUVBeEE0NFBqcElTR2l6VWtJcTJoeDQxbFJETElJOFQyQkt5b3UzSgoyd2Rhb2VYYmsxUU5GNThTTmtlb0JsREJ6ZllrM0gwSy9oQUNKbGVwVUM0QkMrSmxCMnZOOFRxSVgyeS9lUWhjCjJwYURtZG5XeWZyR1hFeVRTNEpUdTZKY1hKT1VlTUorQU1Qb3VjTFZJR0hwTWFrMVNYemZ3STVUN0hSaFlQSnoKMUtPM0IrTUNnWUFxNTl4R0hOb0xMRE5wd2U4YnlRTkNiL0hidnpNMzdDZVpPYWN2d2hYcjZveTdhcVoraE1VCklObThwMnA5RE94MWEwck9CT3NMWStaaXoyeXJjbjA5dk9ZN1piVk5CS3R0L3ZXRUJNMk80MzNPcStvRWorc1dmCisvQ2t6SHdsbTZ5RmMyT1k2S1ZqUlQyd1JOVWdpZ1BRRDExckRXQTMweExLYkF2aU5PL0crUUtCZ0N5aGg0ZGoKTFdHT3RJUmRtL1BRQVBLS2JROW40MVNsclRWNm5TSElJdElJeWx4WUhMa3FhL0wvalRraTJYeFNOVklkRll1UgppV3ZCT1VLUnRwMUdCVW9UT09kYU5BSEZlREhOdlpYbC9qL2dZQTNMa2EwaG9jYm0vTGtTMVlRZDlRY3BBQmFjCmd6Y0hMQTRiUEVPYUNnK1k1amVvTDJCQ0hrazdxVE1Yc211UkFvR0FRUGRtckNHNWNGOXlpVHdYcTZ0MDFQRmUKclhRL0p6SENiSXhxdmtjaThvcnduelx6bjRmUXpMRHZwNzlIdktGRlhLcnFZMjBQNDFnZklIb1FqNjBHSFdnNgpUMmZaNVh6Sm1yOVgx dDVMTVlyVmdnNytPQ1lHV2c4RTBEMVdVeStBOU1nc0pUK2tnTWZYNEdNVHo0UW82WWlsCkYzU1I4enZabmk4bmpIaDNzMzA9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K";

  const PRIVATE_KEY = Buffer.from(b64Key, 'base64').toString('utf-8');

  const serviceAccountAuth = new JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

  try {
    const { 
      nombre_contacto, email_contacto, telefono_contacto, 
      tipo_dispositivo, tipo_falla, servicio_solicitado, fecha_contacto 
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
        <title>¡Éxito! - ReparacionesYa!</title>
        <style>
          body { font-family: sans-serif; background: #764ba2; display: flex; justify-content: center; align-items: center; height: 100vh; color: white; margin: 0; }
          .card { background: white; color: #333; padding: 40px; border-radius: 15px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
          .btn { background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1 style="color: #4CAF50;">¡Datos Recibidos!</h1>
          <p>Gracias <strong>${datosFormulario.Nombre}</strong>. Ya agendamos tu consulta.</p>
          <a href="/" class="btn">Volver al Inicio</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('ERROR FINAL:', error);
    return res.status(500).json({ 
      error: 'Error en el servidor', 
      message: error.message 
    });
  }
};const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  const SPREADSHEET_ID = '1vYddDhWzv8WsPAeWM4zG7LCA7cjl0SDFUlNn_N-roo0';
  const CLIENT_EMAIL = "reparacionesya@reparacionesya-495022.iam.gserviceaccount.com";

  // CLAVE DIRECTA: Formato exacto que espera OpenSSL
  const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCkWuNQvWP0pjni\n" +
    "lOcAmBNpGsQqrDIspS1bYk+U7XKkrzFdlhteTvJzMJpJSrGyCfeLUEkkWw4GTMkp\n" +
    "9mLOGANS5I/6M8c5oglA8r2RLC11nNP7a+XhujCkvTxog28HkicQVBaayxRx8f5W\n" +
    "h/hGBldGu/BVCQB828Qq6jCi1cylCMtyJ8QYGfkTaKCiB/wXC8AS/yMxYKbXsQe6\n" +
    "qhpcuWvkRC7acxwxDYPJskn8L0W3LwxtYZv/QgpXfmbnKvKIXH3P0G9huh/jtM1r\n" +
    "/YbjvTNhd2pr3SA9G7ecxiW+AvL+xlDuUdiB697IlnSkUykiZDlMGTs+cn2rdpnP\n" +
    "fDTBVNZ7AgMBAAECgf9HQyFM4NF2QpzWobmHiGjiKbjkx8T5lqUT+oyHBm2u+kdt\n" +
    "TKiRO6nkSC6dmMVzbN7oiOct3E04bhLLHwm4UrEeP/wtgEXht2BLyPRo/b64QEep\n" +
    "vB7wwMpWo7aNmm+J2NUXP16Nv4Ad589ftZTwx88P3G1YcY7ElIV6FhEAibMx2uxM\n" +
    "GHRd8qGT7u1N8VCeo/h7Hd+JXlbEE5BJKV13VDo9oL8Dg0wXHqK+D2GaFb2maq1H\n" +
    "BZ19V6zKzjneBqJLRgxnQBDtYdJOBj3qyW7+ms1ohAH+VQXysYSXGNuZcomPUARl\n" +
    "ELt7GtzLit7VlZrFA9hD81+tgvqSvSD8PHnZQvECgYEA1pm+gn5VJ2HpL9gXq0Nu\n" +
    "9P8ZAvcTb+ahYaib3QVa4gyUdSTvrdiEAbfJZws3oeD2+5lks9FdfjYTUSKsNFMn\n" +
    "GuIq7HJEyBsPvp04FJbwRCqkR6C8x+f2DOP7wnKWIMfLCUdQFw8buNtOyQMYO9ie\n" +
    "h2D+WPNETprnyH2h1YqeSokCgYEAxA+4PjpISGizUkIq2eh41lRGLI8T2BKyou3J\n" +
    "2wdaoeXbk1QNF58SNkeoBlDBzfYk3H0K/hACJlepUC4BC+JlB2vN8TqIX2y/eQhc\n" +
    "2paDmdnWyfrGXEyTS4JTu6JcXJOUeMJ+AMPoucLVIGHpMak1SXzfwI5T4HRhYPJz\n" +
    "1KO3B+MCgYAq59xGHNoLoLDNpwe8byQNCb/HbvzM37CeZOacvwhXr6oy7aqZ+HMU\n" +
    "INm8p2p9DAx1a0rOBOsLY+Ziz2rcn09vOY7ZbVNBKt/v/WEMBM2O43Oq+oEj+sWf\n" +
    "+CkKzHwlm6yFc2OY6KVjRT2wRNUgigPQD11rDWA30xLKbAviNO/G+QKBgCyih4dj\n" +
    "LWGOtIRdm/PQAPKKbQ9n41SlrRV6nSHIItIIylxYHkLqa/L/jTki2XxSNUIdFYuR\n" +
    "iWvBOUKPtp1GBUoTOOdaNAHFeDHNvZXl/j/gYA3Lka0hocbm/LkS1YQd9QcpABac\n" +
    "gzcHLA4bPEOaCg+Y5jeoL2BCHok7qTMXsmuRAoGAQPdmrCG5cF9yiTwXq6t01PFe\n" +
    "xhQ/JzHCbIxqvkci8orwnzLzn4fQzLDvpq9HvKFFXKrqY20P41gfIHoQj60GHWg6\n" +
    "TlfZ5XzJmr9X1t5L5IrVgg7+OCYGWg8E0D1WUy+A9MgsJT+kgMfX4GMTz4Qo6Yil\n" +
    "F3SR8zvZZi8njNh3s30=\n" +
    "-----END PRIVATE KEY-----\n";

  const serviceAccountAuth = new JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

  try {
    const { nombre_contacto, email_contacto, telefono_contacto, tipo_dispositivo, tipo_falla, servicio_solicitado, fecha_contacto } = req.body;

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
        <title>Éxito - ReparacionesYa!</title>
        <style>
          body { font-family: sans-serif; background: #2c3e50; display: flex; justify-content: center; align-items: center; height: 100vh; color: white; margin: 0; }
          .card { background: white; color: #333; padding: 30px; border-radius: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 style="color: #27ae60;">¡Formulario Recibido!</h2>
          <p>Hola ${datosFormulario.Nombre}, ya agendamos tu consulta técnica.</p>
          <a href="/" style="background: #27ae60; color: white; padding: 10px; text-decoration: none; border-radius: 5px;">Volver</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('ERROR:', error);
    // Si el error persiste, enviamos el mensaje exacto para ver qué lo causa
    return res.status(500).json({ error: error.message });
  }
};