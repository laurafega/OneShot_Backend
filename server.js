const express    = require('express');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config();
require('./cron/crearRetosDiarios');
require('./cron/borrarFotosAntiguas');

const app        = express();
const HOST       = process.env.HOST || '0.0.0.0';
const PORT       = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir estáticos: carpeta uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// Rutas
const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);

const gruposRoutes = require('./routes/grupos');
app.use('/grupos', gruposRoutes);

const retosRoutes = require('./routes/retos');
app.use('/retos', retosRoutes);

const fotosRoutes = require('./routes/fotos');
app.use('/fotos', fotosRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🎯 OneShot API funcionando');
});

// Arrancar servidor
app.listen(PORT, HOST, () => {
  console.log(`🚀 OneShot API corriendo en http://${HOST}:${PORT}`);
});
