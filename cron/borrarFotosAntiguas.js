const cron       = require('node-cron');
const fs         = require('fs');
const path       = require('path');
const connection = require('../db');

cron.schedule('59 23 * * *', async () => {
  console.log('[borrarFotosAntiguas] Empezando tarea de limpieza');

  try {
    // Obtener todas las fotos cuya fecha es anterior a hoy
    const [oldPhotos] = await connection.query(
      "SELECT id, imagen_url FROM fotos WHERE DATE(fecha) < CURDATE()"
    );
    console.log(`[borrarFotosAntiguas] Fotos antiguas encontradas: ${oldPhotos.length}`);

    for (const { id, imagen_url } of oldPhotos) {
      // Borrar el fichero en disco
      const filePath = path.join(__dirname, '..', imagen_url);
      fs.unlink(filePath, err => {
        if (err) console.error('[borrarFotosAntiguas] Error borrando archivo:', filePath, err);
        else          console.log('[borrarFotosAntiguas] Archivo borrado:', filePath);
      });

      // Eliminar registro en la base de datos
      await connection.query('DELETE FROM fotos WHERE id = ?', [id]);
      console.log('[borrarFotosAntiguas] Registro de BD eliminado para foto id=', id);
    }

    console.log('[borrarFotosAntiguas] Tarea completada');
  } catch (err) {
    console.error('[borrarFotosAntiguas] Error en la tarea:', err);
  }
});
