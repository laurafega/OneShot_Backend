const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/verificarToken');
const { editarReto } = require('../controllers/retosController');

router.put('/editar-reto', verificarToken, editarReto);

module.exports = router;
