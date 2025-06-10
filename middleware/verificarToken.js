const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.warn('Token no proporcionado');
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.warn('Formato de token inválido');
    return res.status(400).json({ error: 'Formato de token inválido' });
  }

  const token = tokenParts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token inválido o expirado:', err.message);
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.usuario = decoded;
    next();
  });
};
