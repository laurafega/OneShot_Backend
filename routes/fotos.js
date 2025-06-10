const express        = require('express');
const router         = express.Router();
const verificarToken = require('../middleware/verificarToken');
const upload         = require('../middleware/upload');
const fotosCtrl      = require('../controllers/fotosController');

router.use(verificarToken);

// Subir o reemplazar foto
router.post(
  '/subir-foto/:grupo_id',
  (req, res, next) => {
    upload.single('foto')(req, res, err => {
      if (err) {
        console.error('[MulterError]', err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  fotosCtrl.uploadOrReplace
);

// Listar fotos del reto de hoy
router.get(
  '/grupo/:groupId',
  fotosCtrl.listForGroup
);

// Valorar foto
router.post(
  '/:fotoId/rate',
  fotosCtrl.ratePhoto
);

module.exports = router;
