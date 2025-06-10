const cron       = require('node-cron');
const connection = require('../db');
const moment     = require('moment-timezone');

moment.tz.setDefault('Europe/Madrid');

cron.schedule('1 0 * * *', async () => {
  console.log('[cron] Iniciando reparto secuencial de retos diarios');

  const fechaHoy = moment().format('YYYY-MM-DD');

  try {
    //Obtener todos los grupos
    const [grupos] = await connection.query('SELECT id FROM grupos');

    for (const { id: grupoId } of grupos) {
      try {
        // Si ya hay reto de hoy, saltar
        const [existentes] = await connection.query(
          'SELECT COUNT(*) AS cnt FROM retos WHERE grupo_id = ? AND fecha = ?',
          [grupoId, fechaHoy]
        );
        if (existentes[0].cnt > 0) {
          console.log(`Grupo ${grupoId}: reto para ${fechaHoy} ya existe`);
          continue;
        }

        // Traer miembros ordenados por fecha_union
        const [miembros] = await connection.query(
          'SELECT usuario_id FROM usuarios_grupos WHERE grupo_id = ? ORDER BY fecha_union',
          [grupoId]
        );
        if (miembros.length === 0) {
          console.warn(`Grupo ${grupoId} no tiene miembros`);
          continue;
        }

        //Contar retos previos para este grupo
        const [previos] = await connection.query(
          'SELECT COUNT(*) AS cnt FROM retos WHERE grupo_id = ?',
          [grupoId]
        );
        const totalPrevios = previos[0].cnt;

        // Elegir al miembro correspondiente en round-robin
        const index  = totalPrevios % miembros.length;
        const elegido = miembros[index].usuario_id;

        // Insertar el reto con creado_por = elegido
        await connection.query(
          `INSERT INTO retos (grupo_id, fecha, descripcion, creado_por)
           VALUES (?, ?, ?, ?)`,
          [grupoId, fechaHoy, '¡Reto pendiente de ser definido!', elegido]
        );
        console.log(`Grupo ${grupoId}: reto creado para ${fechaHoy} por usuario ${elegido}`);

      } catch (errGrupo) {
        console.error(`Grupo ${grupoId}: error en cron de retos —`, errGrupo.message);
      }
    }
  } catch (err) {
    console.error('Error general en cron de retos diarios:', err.message);
  }
});
