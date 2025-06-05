const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db');

// POST /usuarios/registro
exports.registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log('📥 Paso 1: Recibido', req.body);

  if (!nombre || !email || !password) {
    console.log('❌ Paso 2: Faltan campos');
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    console.log('🔎 Paso 3: Verificando email existente...');
    const [existe] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existe.length > 0) {
      console.log('⚠️ Paso 4: Email ya registrado');
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    console.log('🔐 Paso 5: Encriptando contraseña...');
    const hash = await bcrypt.hash(password, 10);

    console.log('🟨 Paso 6: Insertando usuario con:', nombre, email, hash);
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hash]
    );

    console.log('✅ Paso 7: Usuario registrado con ID:', result.insertId);
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error('❌ Paso 8: ERROR en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// POST /usuarios/login
exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  console.log('📩 Login intento con:', email);

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

    console.log('✅ Login correcto para usuario ID:', usuario.id);
    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
