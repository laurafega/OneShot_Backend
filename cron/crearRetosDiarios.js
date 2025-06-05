const cron = require('node-cron');
const connection = require('../db');
const moment = require('moment');

// Ejecutar todos los días a las 00:01 AM
cron.schedule('1 0 * * *', async () => {
  console.log('📆 Ejecutando tarea automática para crear retos diarios...');

  try {
    const [grupos] = await connection.query('SELECT id FROM grupos');
    const fechaHoy = moment().format('YYYY-MM-DD');

    for (const grupo of grupos) {
      const grupoId = grupo.id;

      try {
        // Verificar si ya existe un reto para este grupo y fecha
        const [existe] = await connection.query(
          'SELECT id FROM retos WHERE grupo_id = ? AND fecha = ?',
          [grupoId, fechaHoy]
        );

        if (existe.length > 0) {
          console.log(`⏭ Ya existe un reto para el grupo ${grupoId} hoy (${fechaHoy})`);
          continue;
        }

        // Obtener miembros del grupo
        const [miembros] = await connection.query(
          'SELECT usuario_id FROM usuarios_grupos WHERE grupo_id = ?',
          [grupoId]
        );

        if (miembros.length === 0) {
          console.log(`⚠️ Grupo ${grupoId} no tiene miembros`);
          continue;
        }

        const elegido = miembros[Math.floor(Math.random() * miembros.length)].usuario_id;

        // Insertar nuevo reto
        await connection.query(
          `INSERT INTO retos (grupo_id, fecha, descripcion, creado_por)
           VALUES (?, ?, ?, ?)`,
          [grupoId, fechaHoy, '¡Reto pendiente de ser definido!', elegido]
        );

        console.log(`✅ Reto creado para grupo ${grupoId}, por usuario ${elegido}`);

      } catch (errGrupo) {
        console.error(`❌ Error al procesar grupo ${grupoId}:`, errGrupo.message);
      }
    }
  } catch (error) {
    console.error('❌ Error general en el cron de retos diarios:', error.message);
  }
});
