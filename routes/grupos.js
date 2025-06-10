const express        = require('express');
const router         = express.Router();
const gruposCtrl     = require('../controllers/gruposController');
const verificarToken = require('../middleware/verificarToken');

router.post('/crear-grupo',  verificarToken, gruposCtrl.crearGrupo);
router.post('/unirse-grupo', verificarToken, gruposCtrl.unirseAGrupo);
router.get('/mis-grupos',     verificarToken, gruposCtrl.misGrupos);
router.get('/:id',            verificarToken, gruposCtrl.obtenerGrupo);

router.post('/:id/retos',     verificarToken, gruposCtrl.actualizarReto);

module.exports = router;

