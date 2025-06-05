const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/verificarToken');
const upload = require('../middleware/upload');
const fs = require('fs');
const connection = require('../db');

router.post('/subir-foto', verificarToken, upload.single('foto'), async (req, res) => {
  const userId = req.usuario.id;
  const grupoId = req.body.grupo_id;
  const fecha = new Date().toISOString().slice(0, 10);

  if (!grupoId) {
    return res.status(400).json({ error: 'Falta el grupo_id' });
  }

  try {
    // Buscar reto activo del día para el grupo
    const [retosHoy] = await connection.query(
      'SELECT id FROM retos WHERE grupo_id = ? AND fecha = ?',
      [grupoId, fecha]
    );

    if (retosHoy.length === 0) {
      return res.status(400).json({ error: 'No hay reto activo para este grupo hoy' });
    }

    const retoId = retosHoy[0].id;

    // Revisar si ya subió foto hoy para este reto
    const [fotosExistentes] = await connection.query(
      'SELECT id FROM fotos WHERE usuario_id = ? AND reto_id = ?',
      [userId, retoId]
    );

    if (fotosExistentes.length > 0) {
      return res.status(409).json({ error: 'Ya subiste una foto para este reto hoy' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const nombreArchivo = req.file.filename;

    // Insertar registro en tabla fotos
    await connection.query(
      `INSERT INTO fotos (usuario_id, grupo_id, reto_id, fecha, nombre_archivo)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, grupoId, retoId, fecha, nombreArchivo]
    );

    res.status(201).json({ mensaje: 'Foto subida correctamente', filename: nombreArchivo });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir la foto' });
  }
});

module.exports = router;

