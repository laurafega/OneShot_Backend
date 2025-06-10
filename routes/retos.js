// routes/retos.js
const express        = require('express');
const router         = express.Router();
const verificarToken = require('../middleware/verificarToken');
const retosCtrl      = require('../controllers/retosController');

router.use(verificarToken);

// quién está asignado hoy
router.get(
  '/grupos/:groupId/challenges/assigned',
  retosCtrl.getAssignedUser
);

// Obtener reto diario de hoy
router.get(
  '/grupos/:groupId/challenges/daily',
  retosCtrl.getDailyChallenge
);

// Actualizar descripción del reto diario (solo asignado)
router.post(
  '/grupos/:groupId/challenges/daily',
  retosCtrl.updateDailyChallenge
);

// Tu ruta existente de edición
router.put(
  '/editar-reto',
  retosCtrl.editarReto
);

module.exports = router;
