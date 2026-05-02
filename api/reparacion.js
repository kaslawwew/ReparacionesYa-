const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const SPREADSHEET_ID = '1vYddDhWzv8WsPAeWM4zG7LCA7cjl0SDFUlNn_N-roo0';
    const CLIENT_EMAIL = "reparacionesya@reparacionesya-495022.iam.gserviceaccount.com";
    
    // Usamos el formato de "Backticks" para que Node respete los saltos de línea exactos
    const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
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
      Fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
    });

    return res.status(200).send('<h1>¡Enviado con éxito!</h1><a href="/">Volver</a>');

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};