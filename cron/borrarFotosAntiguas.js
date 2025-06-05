const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

cron.schedule('59 23 * * *', () => {
  const dir = './uploads';
  const hoy = new Date().toISOString().slice(0, 10);

  fs.readdir(dir, (err, files) => {
    if (err) return console.error('Error leyendo uploads:', err);

    files.forEach(file => {
      if (!file.includes(hoy)) {
        fs.unlink(path.join(dir, file), err => {
          if (err) console.error('Error borrando archivo:', file, err);
          else console.log(`Archivo borrado: ${file}`);
        });
      }
    });
  });
});
