const pool = require('../db'); // usando mysql2/promise
const crypto = require('crypto');

// Crear un grupo
exports.crearGrupo = async (req, res) => {
  console.log('🟡 Entrando a crearGrupo...');

  const { nombre } = req.body;
  const usuarioId = req.usuario?.id;

  console.log('🟢 Datos recibidos:', { nombre, usuarioId });

  if (!nombre) return res.status(400).json({ error: 'El nombre del grupo es obligatorio' });
  if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });

  const codigo = crypto.randomBytes(3).toString('hex');

  try {
    const [grupoResult] = await pool.query(
      'INSERT INTO grupos (nombre, codigo) VALUES (?, ?)',
      [nombre, codigo]
    );

    const grupoId = grupoResult.insertId;
    console.log('✅ Grupo creado con ID:', grupoId);

    await pool.query(
      'INSERT INTO usuarios_grupos (usuario_id, grupo_id) VALUES (?, ?)',
      [usuarioId, grupoId]
    );

    console.log('✅ Usuario unido al grupo correctamente');
    res.status(201).json({ mensaje: 'Grupo creado con éxito', codigo });
  } catch (err) {
    console.error('❌ Error al crear grupo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Unirse a un grupo existente con un código
exports.unirseAGrupo = async (req, res) => {
  const { codigo } = req.body;
  const usuarioId = req.usuario?.id;

  console.log('📥 Unirse a grupo con código:', codigo, 'por usuario ID:', usuarioId);

  if (!codigo) return res.status(400).json({ error: 'Código del grupo requerido' });
  if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });

  try {
    const [grupoRows] = await pool.query(
      'SELECT id FROM grupos WHERE codigo = ?',
      [codigo]
    );

    console.log('📡 Resultado del SELECT grupos:', grupoRows);

    if (grupoRows.length === 0) {
      console.log('⚠️ Grupo no encontrado con código:', codigo);
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }

    const grupoId = grupoRows[0].id;
    console.log('🔍 Grupo encontrado: ID =', grupoId);

    await pool.query(
      'INSERT INTO usuarios_grupos (usuario_id, grupo_id) VALUES (?, ?)',
      [usuarioId, grupoId]
    );

    console.log(`✅ Usuario ${usuarioId} unido al grupo ${grupoId}`);
    res.status(200).json({ mensaje: 'Unido al grupo correctamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('⚠️ Ya estás en este grupo');
      return res.status(409).json({ error: 'Ya estás en este grupo' });
    }

    console.error('❌ Error al unirse al grupo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Listar los grupos del usuario autenticado
exports.listarMisGrupos = async (req, res) => {
  const usuarioId = req.usuario?.id;

  console.log('📋 Listando grupos para usuario ID:', usuarioId);

  if (!usuarioId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    const [grupos] = await pool.query(`
      SELECT g.id, g.nombre, g.codigo
      FROM grupos g
      JOIN usuarios_grupos ug ON g.id = ug.grupo_id
      WHERE ug.usuario_id = ?
    `, [usuarioId]);

    res.status(200).json({ grupos });
  } catch (err) {
    console.error('❌ Error al obtener los grupos del usuario:', err);
    res.status(500).json({ error: 'Error al obtener los grupos' });
  }
};
