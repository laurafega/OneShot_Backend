const cron       = require('node-cron');
const connection = require('../db');

cron.schedule('55 23 * * *', async () => {
  console.log('[decidirGanador] Buscando ganador del reto de hoy');
  try {
    // Averigua el reto de hoy
    const [[ retoHoy ]] = await connection.query(
      'SELECT id FROM retos WHERE DATE(fecha)=CURDATE()'
    );
    if (!retoHoy) return console.log('No hay reto hoy');

    //Suma ratings por foto
    const [rows] = await connection.query(
      `SELECT r.foto_id, f.usuario_id, SUM(r.rating) AS puntos
         FROM ratings r
         JOIN fotos f ON f.id=r.foto_id
        WHERE f.reto_id=?
        GROUP BY r.foto_id
        ORDER BY puntos DESC
        LIMIT 1`,
      [retoHoy.id]
    );
    if (rows.length === 0) {
      console.log('No hay valoraciones hoy');
      return;
    }
    const win = rows[0];
    console.log('[decidirGanador] Ganador foto', win);

    // Guardar en tabla winners
    await connection.query(
      `INSERT INTO winners (reto_id,foto_id,usuario_id,puntos)
       VALUES (?,?,?,?)`,
      [retoHoy.id, win.foto_id, win.usuario_id, win.puntos]
    );

    // (Opcional) notificar o loguear
    console.log(`El ganador del reto ${retoHoy.id} es usuario ${win.usuario_id}`);

  } catch (err) {
    console.error('[decidirGanador] Error:', err);
  }
});
