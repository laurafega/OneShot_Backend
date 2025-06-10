const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const verificarToken = require('../middleware/verificarToken');

// Rutas públicas
router.post('/registro', usuariosController.registrarUsuario);
router.post('/login', usuariosController.loginUsuario);

router.put('/actualizar', verificarToken, usuariosController.actualizarUsuario);

//Ruta protegida (va antes del export)
router.get('/perfil', verificarToken, usuariosController.obtenerPerfil);

module.exports = router;
