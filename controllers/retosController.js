const pool = require('../db');
const moment = require('moment');

// PUT /editar-reto
const editarReto = async (req, res) => {
  const user_id = req.usuario.id;
  const { grupo_id, descripcion } = req.body;
  const fechaHoy = moment().format('YYYY-MM-DD');

  try {
    const [retos] = await pool.query(
      'SELECT * FROM retos WHERE grupo_id = ? AND fecha = ?',
      [grupo_id, fechaHoy]
    );

    if (retos.length === 0) {
      return res.status(404).json({ mensaje: 'No hay reto hoy para este grupo' });
    }

    const reto = retos[0];

    if (reto.creado_por !== user_id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para editar este reto' });
    }

    await pool.query(
      'UPDATE retos SET descripcion = ? WHERE id = ?',
      [descripcion, reto.id]
    );

    res.status(200).json({ mensaje: 'Reto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el reto' });
  }
};

module.exports = { editarReto };
