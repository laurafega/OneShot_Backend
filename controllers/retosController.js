const pool   = require('../db');
const moment = require('moment-timezone');
moment.tz.setDefault('Europe/Madrid');

exports.getAssignedUser = async (req, res, next) => {
  const groupId = req.params.groupId;
  console.log('[getAssignedUser] Grupo', groupId);
  try {
    const [gRows] = await pool.query(
      'SELECT created_at FROM grupos WHERE id = ?',
      [groupId]
    );
    if (!gRows.length) {
      console.warn('[getAssignedUser] Grupo no existe:', groupId);
      return res.sendStatus(404);
    }
    const createdAt = moment(gRows[0].created_at).startOf('day');
    const [members] = await pool.query(
      'SELECT usuario_id, fecha_union FROM usuarios_grupos WHERE grupo_id = ? ORDER BY fecha_union ASC',
      [groupId]
    );
    if (!members.length) {
      console.warn('[getAssignedUser] Grupo sin miembros:', groupId);
      return res.sendStatus(204);
    }
    const today = moment().startOf('day');
    const days = today.diff(createdAt, 'days');
    const index = days % members.length;
    const assignedUserId = members[index].usuario_id;
    console.log('[getAssignedUser] Día', days, 'Índice', index, 'Usuario asignado', assignedUserId);
    res.json({ assignedUserId });
  } catch (err) {
    console.error('[getAssignedUser] Error:', err);
    next(err);
  }
};

exports.getDailyChallenge = async (req, res, next) => {
  const groupId = req.params.groupId;
  const fechaHoy = moment().format('YYYY-MM-DD');
  console.log('[getDailyChallenge] Grupo', groupId, 'Fecha', fechaHoy);
  try {
    const [rows] = await pool.query(
      'SELECT id, grupo_id, fecha, descripcion, creado_por FROM retos WHERE grupo_id = ? AND fecha = ?',
      [groupId, fechaHoy]
    );
    if (!rows.length) {
      console.log('[getDailyChallenge] No hay reto hoy para grupo:', groupId);
      return res.sendStatus(204);
    }
    console.log('[getDailyChallenge] Reto encontrado id=', rows[0].id);
    res.json(rows[0]);
  } catch (err) {
    console.error('[getDailyChallenge] Error:', err);
    next(err);
  }
};

exports.updateDailyChallenge = async (req, res, next) => {
  const userId = req.usuario.id;
  const groupId = req.params.groupId;
  const { descripcion } = req.body;
  const fechaHoy = moment().format('YYYY-MM-DD');
  console.log('[updateDailyChallenge] Usuario', userId, 'Grupo', groupId, 'Fecha', fechaHoy);
  try {
    const [rows] = await pool.query(
      'SELECT id, creado_por FROM retos WHERE grupo_id = ? AND fecha = ?',
      [groupId, fechaHoy]
    );
    if (!rows.length) {
      const [insertRes] = await pool.query(
        `INSERT INTO retos (grupo_id, fecha, descripcion, creado_por)
         VALUES (?, ?, ?, ?)`,
        [groupId, fechaHoy, descripcion, userId]
      );
      console.log('[updateDailyChallenge] Reto creado id=', insertRes.insertId);
      return res.status(201).json({
        mensaje: 'Reto diario creado correctamente',
        descripcion,
        id: insertRes.insertId
      });
    }
    const reto = rows[0];
    if (reto.creado_por !== userId) {
      console.warn('[updateDailyChallenge] Usuario no autorizado:', userId);
      return res.status(403).json({ mensaje: 'No tienes permiso para editar este reto hoy' });
    }
    await pool.query(
      'UPDATE retos SET descripcion = ? WHERE id = ?',
      [descripcion, reto.id]
    );
    console.log('[updateDailyChallenge] Reto actualizado id=', reto.id);
    return res.json({
      mensaje: 'Reto diario actualizado correctamente',
      descripcion
    });
  } catch (err) {
    console.error('[updateDailyChallenge] Error:', err);
    return next(err);
  }
};

exports.editarReto = async (req, res) => {
  const userId = req.usuario.id;
  const { grupo_id, descripcion } = req.body;
  const fechaHoy = moment().format('YYYY-MM-DD');
  console.log('[editarReto] Usuario', userId, 'Grupo', grupo_id, 'Fecha', fechaHoy);
  try {
    const [retos] = await pool.query(
      'SELECT * FROM retos WHERE grupo_id = ? AND fecha = ?',
      [grupo_id, fechaHoy]
    );
    console.log('[editarReto] Retos encontrados:', retos.length);
    if (retos.length === 0) {
      console.warn('[editarReto] No hay reto hoy para grupo:', grupo_id);
      return res.status(404).json({ mensaje: 'No hay reto hoy para este grupo' });
    }
    const reto = retos[0];
    if (reto.creado_por !== userId) {
      console.warn('[editarReto] Usuario no autorizado:', userId);
      return res.status(403).json({ mensaje: 'No tienes permiso para editar este reto' });
    }
    await pool.query(
      'UPDATE retos SET descripcion = ? WHERE id = ?',
      [descripcion, reto.id]
    );
    console.log('[editarReto] Reto actualizado id=', reto.id);
    res.status(200).json({ mensaje: 'Reto actualizado correctamente' });
  } catch (error) {
    console.error('[editarReto] Error al actualizar reto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el reto' });
  }
};
