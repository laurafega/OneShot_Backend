const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    const userId = req.usuario.id;
    const ext    = path.extname(file.originalname).toLowerCase();
    const name   = `u${userId}_${uuidv4()}${ext}`;  // elimina la fecha, usa UUID
    cb(null, name);
  }
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg','.jpeg','.png','.gif'].includes(ext)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  }
});
