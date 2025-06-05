const express = require('express');
const router = express.Router();
const gruposController = require('../controllers/gruposController');
const verificarToken = require('../middleware/verificarToken');

// Crear un nuevo grupo (usuario autenticado)
router.post('/crear-grupo', verificarToken, gruposController.crearGrupo);

// Unirse a un grupo existente con código
router.post('/unirse-grupo', verificarToken, gruposController.unirseAGrupo);
router.get('/mis-grupos', verificarToken, gruposController.listarMisGrupos);
module.exports = router;

