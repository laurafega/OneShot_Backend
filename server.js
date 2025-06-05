const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connection = require('./db');

// Ejecuta cron jobs
require('./cron/crearRetosDiarios');
require('./cron/borrarFotosAntiguas');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rutas
const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);

const gruposRoutes = require('./routes/grupos');
app.use('/grupos', gruposRoutes);

const retosRoutes = require('./routes/retos');
app.use('/retos', retosRoutes);

const fotosRoutes = require('./routes/fotos');
app.use('/fotos', fotosRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('🎯 OneShot API funcionando');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
});
