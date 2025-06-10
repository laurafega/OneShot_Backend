const pool = require('./db');  
(async () => {
  try {
    // Intenta hacer una consulta sencilla
    const [rows] = await pool.query('SELECT NOW() AS fechaActual');
    console.log('Conexión OK, fecha actual:', rows[0].fechaActual);
    process.exit(0);
  } catch (err) {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  }
})();
