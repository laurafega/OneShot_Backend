const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/verificarToken');
const upload = require('../middleware/upload');
const fs = require('fs');

router.post('/subir-foto', verificarToken, upload.single('foto'), (req, res) => {
  const userId = req.usuario.id;
  const grupoId = req.body.grupo_id;
  const fecha = new Date().toISOString().slice(0, 10);

  if (!grupoId) {
    return res.status(400).json({ error: 'Falta el grupo_id' });
  }

  const dir = './uploads';
  const archivos = fs.readdirSync(dir);
  const fotoExistente = archivos.find(f => f.startsWith(`foto_${userId}_${grupoId}_${fecha}`));

  if (fotoExistente) {
    return res.status(409).json({ error: 'Ya subiste una foto para este grupo hoy' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  res.status(201).json({ mensaje: 'Foto subida correctamente', filename: req.file.filename });
});

module.exports = router;
