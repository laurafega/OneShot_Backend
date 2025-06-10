const fs         = require('fs');
const path       = require('path');
const connection = require('../db');

// Subir o reemplazar foto
exports.uploadOrReplace = async (req, res) => {
  console.log('[uploadOrReplace] Start', { params: req.params, file: req.file });

  const userId  = req.usuario.id;
  const grupoId = req.params.grupo_id;

  if (!req.file) {
    console.warn('[uploadOrReplace] No file in request');
    return res.status(400).json({ error: 'No has subido ninguna imagen' });
  }

  try {
    console.log('[uploadOrReplace] Querying active challenge for grupoId=', grupoId);
    const [[ retoHoy ]] = await connection.query(
      'SELECT id FROM retos WHERE grupo_id = ? AND DATE(fecha) = CURDATE()',
      [grupoId]
    );
    if (!retoHoy) {
      console.warn('[uploadOrReplace] No active challenge found');
      return res.status(400).json({ error: 'No hay reto activo para este grupo hoy' });
    }
    console.log('[uploadOrReplace] Active challenge id=', retoHoy.id);

    console.log('[uploadOrReplace] Checking for existing photo for userId=', userId);
    const [fotosExist] = await connection.query(
      'SELECT id, imagen_url FROM fotos WHERE usuario_id = ? AND reto_id = ?',
      [userId, retoHoy.id]
    );
    if (fotosExist.length) {
      const antiguo = fotosExist[0];
      console.log('[uploadOrReplace] Deleting old photo record', antiguo.id);
      await connection.query('DELETE FROM fotos WHERE id = ?', [antiguo.id]);
      const oldPath = path.join(__dirname, '..', antiguo.imagen_url);
      fs.unlink(oldPath, err => {
        if (err) console.error('[uploadOrReplace] Error deleting file:', oldPath, err);
        else console.log('[uploadOrReplace] Old file deleted:', antiguo.imagen_url);
      });
    } else {
      console.log('[uploadOrReplace] No existing photo to delete');
    }

    const filename = req.file.filename;
    const fullPath = `/uploads/${filename}`;
    console.log('[uploadOrReplace] Inserting new photo', { fullPath });
    await connection.query(
      `INSERT INTO fotos (usuario_id, reto_id, fecha, imagen_url)
       VALUES (?, ?, ?, ?)`,
      [userId, retoHoy.id, new Date(), fullPath]
    );
    console.log('[uploadOrReplace] New photo inserted with fullPath:', fullPath);

    res.status(201).json({ mensaje: 'Foto subida', url: fullPath });
  } catch (err) {
    console.error('[uploadOrReplace] Error processing upload:', err);
    res.status(500).json({ error: 'Error al procesar la foto' });
  }
};

// Listar fotos para grupo
exports.listForGroup = async (req, res) => {
  const grupoId = req.params.groupId;
  console.log('[listForGroup] Called for grupoId=', grupoId);

  try {
    console.log('[listForGroup] Querying active challenge');
    const [[ retoHoy ]] = await connection.query(
      'SELECT id FROM retos WHERE grupo_id = ? AND DATE(fecha) = CURDATE()',
      [grupoId]
    );
    if (!retoHoy) {
      console.warn('[listForGroup] No active challenge, returning empty');
      return res.json({ fotos: [] });
    }
    console.log('[listForGroup] Active challenge id=', retoHoy.id);

    const [fotos] = await connection.query(
      `SELECT f.id           AS fotoId,
              f.usuario_id   AS usuarioId,
              u.nombre       AS usuarioNombre,
              f.imagen_url
       FROM fotos f
       JOIN usuarios u ON u.id = f.usuario_id
       WHERE f.reto_id = ?`,
      [retoHoy.id]
    );
    console.log('[listForGroup] Photos found count=', fotos.length);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = fotos.map(f => {
      const rawPath = f.imagen_url;
      const url = rawPath.startsWith('/')
        ? `${baseUrl}${rawPath}`
        : `${baseUrl}/${rawPath}`;
      return {
        fotoId:        f.fotoId,
        url,
        usuarioNombre: f.usuarioNombre,
        usuarioId:     f.usuarioId
      };
    });

    console.log('[listForGroup] Returning photos', result);
    res.json({ fotos: result });
  } catch (err) {
    console.error('[listForGroup] Error fetching photos:', err);
    res.status(500).json({ error: 'Error al obtener fotos' });
  }
};

// Valorar una foto
exports.ratePhoto = async (req, res) => {
  const usuarioId = req.usuario.id;
  const fotoId    = req.params.fotoId;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating entre 1 y 5' });
  }

  try {
    await connection.query(
      `INSERT INTO ratings (foto_id, usuario_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?`,
      [fotoId, usuarioId, rating, rating]
    );
    res.json({ mensaje: 'Valoración guardada' });
  } catch (err) {
    console.error('[ratePhoto] Error guardando rating:', err);
    res.status(500).json({ error: 'Error al valorar foto' });
  }
};
