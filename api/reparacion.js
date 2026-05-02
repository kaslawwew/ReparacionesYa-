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
};