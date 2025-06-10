const pool   = require('../db');
const crypto = require('crypto');

exports.crearGrupo = async (req, res) => {
  const { nombre } = req.body;
  const usuarioId = req.usuario.id;
  const codigo = crypto.randomBytes(3).toString('hex');

  try {
    // Creo el grupo
    const [g] = await pool.query(
      'INSERT INTO grupos (nombre, codigo, creador_id) VALUES (?, ?, ?)',
      [nombre, codigo, usuarioId]
    );
    console.log(`[crearGrupo] Grupo creado: id=${g.insertId}`);

    // Inserto al creador en usuarios_grupos
    await pool.query(
      'INSERT INTO usuarios_grupos (usuario_id, grupo_id) VALUES (?, ?)',
      [usuarioId, g.insertId]
    );
    console.log(`[crearGrupo] Usuario ${usuarioId} unido al grupo ${g.insertId}`);

    res.status(201).json({ mensaje: 'Grupo creado con éxito', codigo });
  } catch (err) {
    console.error('[crearGrupo] Error:', err);
    res.status(500).json({ error: 'Error al crear grupo' });
  }
};


exports.unirseAGrupo = async (req, res) => {
  console.log('[unirseAGrupo] Inicio');
  const { codigo } = req.body;
  const usuarioId = req.usuario.id;
  console.log(`Usuario ${usuarioId} intenta unirse al grupo con código="${codigo}"`);

  try {
    const [rows] = await pool.query(
      'SELECT id FROM grupos WHERE codigo = ?',
      [codigo]
    );
    if (!rows.length) {
      console.warn(`[unirseAGrupo] Código no encontrado: ${codigo}`);
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }

    const grupoId = rows[0].id;
    console.log(`[unirseAGrupo] Grupo hallado: id=${grupoId}`);

    await pool.query(
      'INSERT INTO usuarios_grupos (usuario_id, grupo_id) VALUES (?, ?)',
      [usuarioId, grupoId]
    );
    console.log(`[unirseAGrupo] Usuario ${usuarioId} unido al grupo ${grupoId}`);

    res.json({ mensaje: 'Unido al grupo correctamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.warn(`[unirseAGrupo] Usuario ${usuarioId} ya está en el grupo ${codigo}`);
      return res.status(409).json({ error: 'Ya estás en este grupo' });
    }
    console.error('[unirseAGrupo] Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.misGrupos = async (req, res) => {
  console.log('[misGrupos] Inicio');
  const usuarioId = req.usuario.id;
  console.log(`Obteniendo grupos para usuario ${usuarioId}`);

  try {
    const [rows] = await pool.query(`
      SELECT
        g.id,
        g.nombre,
        COALESCE(r.descripcion, '') AS retoDiario,
        (SELECT COUNT(*) FROM usuarios_grupos ug WHERE ug.grupo_id = g.id) AS integrantes,
        (g.creador_id = ?) AS esAdmin
      FROM grupos g
      JOIN usuarios_grupos ug ON ug.grupo_id = g.id
      LEFT JOIN retos r
        ON r.grupo_id = g.id
       AND DATE(r.fecha) = CURDATE()
      WHERE ug.usuario_id = ?
    `, [usuarioId, usuarioId]);

    console.log(`[misGrupos] Encontrados ${rows.length} grupos`);
    res.json({ grupos: rows });
  } catch (err) {
    console.error('[misGrupos] Error:', err);
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
};

exports.obtenerGrupo = async (req, res) => {
  console.log('[obtenerGrupo] Inicio');
  const usuarioId = req.usuario.id;
  const grupoId   = req.params.id;
  console.log(`Solicitando detalle del grupo id=${grupoId}`);

  try {
    const [[g]] = await pool.query(`
      SELECT
        g.id,
        g.nombre,
        g.codigo,
        COALESCE(r.descripcion, '') AS retoDiario,
        r.creado_por              AS usuarioAsignadoId,
        (SELECT COUNT(*) FROM usuarios_grupos ug WHERE ug.grupo_id = g.id) AS integrantes,
        g.creador_id,
        (g.creador_id = ?) AS esAdmin
      FROM grupos g
      LEFT JOIN retos r
        ON r.grupo_id = g.id
       AND DATE(r.fecha) = CURDATE()
      WHERE g.id = ?
    `, [usuarioId, grupoId]);

    if (!g) {
      console.warn(`[obtenerGrupo] Grupo id=${grupoId} no encontrado`);
      return res.status(404).json({ error: 'No encontrado' });
    }

    console.log(`[obtenerGrupo] Detalle cargado para grupo id=${grupoId}`);

    const [[admin]] = await pool.query(
      `SELECT id, nombre, avatar AS avatarUrl
         FROM usuarios
        WHERE id = ?`,
      [g.creador_id]
    );
    console.log(`Administrador encontrado: ${JSON.stringify(admin)}`);

    const [miembros] = await pool.query(
      `SELECT u.id, u.nombre, u.avatar AS avatarUrl
         FROM usuarios u
         JOIN usuarios_grupos ug
           ON ug.usuario_id = u.id
        WHERE ug.grupo_id = ?`,
      [grupoId]
    );
    console.log(`Miembros cargados: count=${miembros.length}`);

    const grupo = {
      ...g,
      administrador: admin || null,
      integrantesUsuarios: miembros
    };

    res.json({ grupo });
  } catch (err) {
    console.error('[obtenerGrupo] Error:', err);
    res.status(500).json({ error: 'Error al obtener grupo' });
  }
};

exports.actualizarReto = async (req, res) => {
  console.log('[actualizarReto] Inicio');
  const usuarioId = req.usuario.id;
  const grupoId   = req.params.id;
  const { descripcion } = req.body;
  console.log(`🔹 Usuario ${usuarioId} actualiza reto para grupo ${grupoId}: "${descripcion}"`);

  try {
    const [result] = await pool.query(
      `UPDATE retos
         SET descripcion = ?
       WHERE grupo_id = ?
         AND DATE(fecha) = CURDATE()
         AND creado_por = ?`,
      [descripcion, grupoId, usuarioId]
    );

    if (result.affectedRows === 0) {
      console.warn(`[actualizarReto] No autorizado o reto no existe para usuario ${usuarioId}`);
      return res.status(403).json({ error: 'No autorizado o reto no existe' });
    }

    console.log(`[actualizarReto] Reto actualizado para grupo ${grupoId} por usuario ${usuarioId}`);
    res.json({ mensaje: 'Reto actualizado con éxito' });
  } catch (err) {
    console.error('[actualizarReto] Error:', err);
    res.status(500).json({ error: 'Error actualizando reto' });
  }
};
