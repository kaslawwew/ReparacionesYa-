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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitud Recibida - ReparacionesYa!</title>
          <style>
              body, html {
                  height: 100%;
                  margin: 0;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              }
              .bg-image {
                  /* Usamos la imagen que proporcionaste */
                  background-image: url('https://reparacionesya-rdhxogk7d-kaslawwews-projects.vercel.app/reparacion-bg.png'); 
                  background-size: cover;
                  background-position: center;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
              }
              /* Capa oscura para que resalte el texto */
              .overlay {
                  position: absolute;
                  top: 0; left: 0; width: 100%; height: 100%;
                  background: rgba(0, 0, 0, 0.6); 
              }
              .content {
                  position: relative;
                  z-index: 1;
                  text-align: center;
                  color: white;
                  padding: 20px;
              }
              h1 { font-size: 2.5rem; margin-bottom: 10px; color: #4ade80; }
              p { font-size: 1.2rem; margin-bottom: 30px; }
              .btn {
                  text-decoration: none;
                  color: white;
                  background-color: #22c55e;
                  padding: 12px 24px;
                  border-radius: 8px;
                  font-weight: bold;
                  transition: 0.3s;
              }
              .btn:hover { background-color: #16a34a; }
          </style>
      </head>
      <body>
          <div class="bg-image">
              <div class="overlay"></div>
              <div class="content">
                  <h1>¡Pronto nos contactaremos contigo!</h1>
                  <p>Desde ya, muchas gracias por solicitar con nosotros.</p>
                  <a href="/" class="btn">Volver al Inicio</a>
              </div>
          </div>
      </body>
      </html>
    `);


  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};