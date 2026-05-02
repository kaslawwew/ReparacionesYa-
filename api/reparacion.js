const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const SPREADSHEET_ID = '1vYddDhWzv8WsPAeWM4zG7LCA7cjl0SDFUlNn_N-roo0';
    const CLIENT_EMAIL = "reparacionesya@reparacionesya-495022.iam.gserviceaccount.com";
    
    // Aquí está tu NUEVA clave, exactamente con los saltos de línea \n
    const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDGPfMSWrMSDJGC\nFtM3OMeECQza1F1emLL/J9OBR1W90I9Rp20XyJnF7QHugZ3Qw0KVJs5iImkmlXn6\nuSaMEs27CMBgXyVB9XN7NRKyDSe8WrVCbpRbNx1OVXaOJVsLIbt4HeFPEhhfX2Sf\n4RO4K334F0HOsWFFjqRL+6KPA4JIqKgtUsUeWMNPfI+YE0zLOZJy8uGkQGmmoDmN\nI9v8m4ItdcSKnK6hwE7ZIOWkwhB2jxqW2/h9wqZgFRbf7YE9jd+oxd5zEOunLxEt\n2l8hhgu92M29qSrGXQMGcLTQeG8+9KXFYNUkYAY2pvAPwEc6O647J1IhCLfhnqtz\nA8Twote5AgMBAAECggEAJAtngtLS9Fksq8aSqNu+CxfKKo+qWmTRRutq3Xqm8FhX\ndrVGdKiYrRAm5cLTev3FwXDI3bb7/3P2NcwsYhOZLISu1db240NJuAEyYQVbUDf9\n9RI+D0e6IGARqk7IewGrIG/uY34ayFyD4z39Y+MkiFNSN86wrQD+hoI+UFqG+ca+\nmKfi1vOLQ0Y5H7PXesa4jc67uzdWcqVqyBS3qgXbL+P+5G+VWZ5NA7hN+OjdrLIl\nTOzGrYmbYv+P1QdFnJZrW5ntyfrkz7m40I+cvA62HMuXKKZ3cejswnwmYXD9y0JS\nQ94QX8q0ld+z7ZudO5dfKc1BJfyg0HG9b/CdIo7zwQKBgQDvxdEMJ0X1VU19bkUf\n8jK1GVOqWTAJQN3IAXPu6EXqJs5tmTP5X8l1hOQyg0wKt/EvpLOPe+XykFUWUei6\nR4YYM1UjW9qvJQu04WWR++7pTNjfX+lVctAMc5nyz0fdzVWg7wrK61u6QxWJQ5TK\nswomzJKsC+2wiBOW6kSW02WsvQKBgQDTqJePkcp8XVIfsxvKvWT6TH09GEvkx9Br\nlX6a3eeoOuttGtzEhzw6Tl19kTOKDP5LNoR0eQw0W2qxp2OBs1ghIaBPEo6EdyuD\nQ5iFvfb9wf/unmxjdF6sQKpllyjZta3aVqE6Tm8xCpei1n3sQrC9SbSjm0w1j0ic\ntHGOzwlMrQKBgQCCb5adie/g2prhFU+9ZUB4jGKbVRFwtzzvRPsQiIMgMiQyMxm3\nG4i4yaZqZErFufMW+/5CnCAnqKThE4YLcEVefO5f4eRBS2Hm8IcUt3zspcWFHuQM\ne/z6CRlCochyvPVMKz4vzYGE/mGE3qLe8i8flEJmHcccNaqSerb9Zdr18QKBgQCN\n6Xr9Gu4dpmBaurdGnufmXoSWAwVXtpVKnOhPI7uf8ylIdPtSla3PFh3fBAz/Yaja\newoiIcsKC8UkqiuwmbPcOvSGL9X4gQJet2K7QVwqVfmoXvYjVLHpYk4dYVVVa1fO\njcj6E/6/be+vkYrKbwibUaDZFVXqj1BLKTz+WFhO3QKBgAgcSiH8oAas7lWsrIe5\nMVFtC2+Cm1GSMfn+xq51PWx2p/NuPMeNVqusumEzcoblD+jJStnU0VCOZFdcIJ8G\nuME6wVImgDCmzeFh5afEL8ik+g06xWpEU3NXm/xKQ2s/t45OKZMZXM5JiSWc6nmN\nGBznSDd0/dU9sAshSOJxHHpd\n-----END PRIVATE KEY-----\n";

    const auth = new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    const body = req.body;
    await sheet.addRow({
      Nombre: body.nombre_contacto || 'N/A',
      Email: body.email_contacto || 'N/A',
      Telefono: body.telefono_contacto || 'N/A',
      Dispositivo: body.tipo_dispositivo || 'N/A',
      Problema: body.tipo_falla || 'N/A',
      Servicio: body.servicio_solicitado || 'N/A',
      Fecha_Contacto: body.fecha_contacto || 'N/A',
      Fecha_Registro: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    });

    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Éxito - ReparacionesYa!</title>
        <style>
          body { font-family: sans-serif; background: #2c3e50; display: flex; justify-content: center; align-items: center; height: 100vh; color: white; margin: 0; }
          .card { background: white; color: #333; padding: 40px; border-radius: 10px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        </style>
      </head>
      <body>
        <div class="card">
          <h2 style="color: #27ae60;">¡Formulario Recibido Exitosamente!</h2>
          <p>Los datos han sido guardados en el sistema.</p>
          <a href="/" style="background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Volver al Inicio</a>
        </div>
      </body>
      </html>
    `);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};