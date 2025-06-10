const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db');

// POST /usuarios/registro
exports.registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log('Paso 1: Recibido', req.body);

  if (!nombre || !email || !password) {
    console.log('Paso 2: Faltan campos');
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    console.log('Paso 3: Verificando email existente...');
    const [existe] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existe.length > 0) {
      console.log('Paso 4: Email ya registrado');
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    console.log('Paso 5: Encriptando contraseña...');
    const hash = await bcrypt.hash(password, 10);

    console.log('Paso 6: Insertando usuario con:', nombre, email, hash);
    // Insertamos con avatar por defecto 'avatar1'
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, email, password, avatar) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, 'avatar1']
    );

    console.log('Paso 7: Usuario registrado con ID:', result.insertId);
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error('Paso 8: ERROR en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// POST /usuarios/login
exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login intento con:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  try {
    const [results] = await connection.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo no encontrado' });
    }

    const usuario = results[0];
    const esCorrecta = await bcrypt.compare(password, usuario.password);

    if (!esCorrecta) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login correcto para usuario ID:', usuario.id);
    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        avatar: usuario.avatar
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// GET /usuarios/perfil
exports.obtenerPerfil = async (req, res) => {
  try {
    // req.usuario ya contiene { id, email } gracias a verificarToken
    const userId = req.usuario.id;
    const [rows] = await connection.query(
      'SELECT id, nombre, email, avatar FROM usuarios WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ usuario: rows[0] });
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// PUT /usuarios/actualizar
exports.actualizarUsuario = async (req, res) => {
  const { nombre, email, password, avatar } = req.body;
  const userId = req.usuario.id; // set por verificarToken

  if (!nombre || !email || !avatar) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar si el email ya está en uso por otro usuario
    const [existe] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [email, userId]
    );
    if (existe.length > 0) {
      return res.status(409).json({ error: 'El correo ya está en uso' });
    }

    // Si enviaron nueva contraseña y es válida, encriptarla
    let hashPassword = null;
    if (password && password.length >= 6) {
      hashPassword = await bcrypt.hash(password, 10);
    }

    // Construir consulta de actualización
    let query = 'UPDATE usuarios SET nombre = ?, email = ?, avatar = ?';
    const params = [nombre, email, avatar];
    if (hashPassword) {
      query += ', password = ?';
      params.push(hashPassword);
    }
    query += ' WHERE id = ?';
    params.push(userId);

    await connection.query(query, params);

    // Devolver los datos actualizados
    const [rows] = await connection.query(
      'SELECT id, nombre, email, avatar FROM usuarios WHERE id = ?',
      [userId]
    );
    res.json({ mensaje: 'Perfil actualizado correctamente', usuario: rows[0] });

  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};
