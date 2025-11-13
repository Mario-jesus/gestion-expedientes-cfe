/**
 * Servidor JSON Server con endpoints personalizados
 * Maneja autenticación y operaciones especiales de usuarios
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware para parsear JSON
server.use(jsonServer.bodyParser);
server.use(middlewares);

// ============================================
// ENDPOINTS DE AUTENTICACIÓN
// ============================================

/**
 * POST /auth/login
 * Simula el login de un usuario
 */
server.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username y password son requeridos',
    });
  }

  // Buscar usuario en la base de datos
  const db = router.db;
  const user = db.get('users').find({ username }).value();

  if (!user) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      error: 'Usuario inactivo',
    });
  }

  // Simular token JWT (en producción sería un token real)
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;

  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

/**
 * POST /auth/logout
 * Simula el logout (en una API real invalidaría el token)
 */
server.post('/auth/logout', (req, res) => {
  res.status(200).json({
    message: 'Logout exitoso',
  });
});

/**
 * GET /auth/me
 * Obtiene el usuario actual basado en el token
 */
server.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token no proporcionado',
    });
  }

  // Extraer el ID del token mock
  const tokenMatch = authHeader.match(/mock-jwt-token-(\d+)-/);
  
  if (!tokenMatch) {
    return res.status(401).json({
      error: 'Token inválido',
    });
  }

  const userId = tokenMatch[1];
  const db = router.db;
  const user = db.get('users').find({ id: userId }).value();

  if (!user) {
    return res.status(401).json({
      error: 'Usuario no encontrado',
    });
  }

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  });
});

/**
 * POST /auth/refresh
 * Refresca el token de autenticación
 */
server.post('/auth/refresh', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token no proporcionado',
    });
  }

  const tokenMatch = authHeader.match(/mock-jwt-token-(\d+)-/);
  
  if (!tokenMatch) {
    return res.status(401).json({
      error: 'Token inválido',
    });
  }

  const userId = tokenMatch[1];
  const newToken = `mock-jwt-token-${userId}-${Date.now()}`;

  res.status(200).json({
    token: newToken,
  });
});

// ============================================
// ENDPOINTS PERSONALIZADOS DE USUARIOS
// ============================================

/**
 * POST /users/:id/toggle-status
 * Alterna el estado activo/inactivo del usuario
 */
server.post('/users/:id/toggle-status', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const user = db.get('users').find({ id }).value();

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
    });
  }

  // Alternar el estado
  const updatedUser = {
    ...user,
    isActive: !user.isActive,
    updatedAt: new Date().toISOString(),
  };

  db.get('users').find({ id }).assign(updatedUser).write();

  res.status(200).json(updatedUser);
});

/**
 * POST /users/:id/change-password
 * Cambia la contraseña del usuario
 */
server.post('/users/:id/change-password', (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      error: 'La contraseña debe tener al menos 6 caracteres',
    });
  }

  const db = router.db;
  const user = db.get('users').find({ id }).value();

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
    });
  }

  // Actualizar la fecha de modificación
  const updatedUser = {
    ...user,
    updatedAt: new Date().toISOString(),
  };

  db.get('users').find({ id }).assign(updatedUser).write();

  res.status(200).json({
    message: 'Contraseña actualizada exitosamente',
  });
});

// ============================================
// MIDDLEWARE PARA LOGGING
// ============================================

server.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// RUTAS POR DEFECTO DE JSON SERVER
// ============================================

// Usar el router por defecto para el resto de endpoints CRUD
server.use(router);

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log('\n🚀 JSON Server está corriendo en:');
  console.log(`   http://localhost:${PORT}`);
  console.log('\n📚 Endpoints disponibles:');
  console.log('\n   Autenticación:');
  console.log('   POST   /auth/login');
  console.log('   POST   /auth/logout');
  console.log('   GET    /auth/me');
  console.log('   POST   /auth/refresh');
  console.log('\n   Usuarios (CRUD):');
  console.log('   GET    /users');
  console.log('   GET    /users/:id');
  console.log('   POST   /users');
  console.log('   PUT    /users/:id');
  console.log('   PATCH  /users/:id');
  console.log('   DELETE /users/:id');
  console.log('   POST   /users/:id/toggle-status');
  console.log('   POST   /users/:id/change-password');
  console.log('\n   Empleados, Archivos, Reportes:');
  console.log('   Endpoints CRUD estándar disponibles');
  console.log('\n✨ Listo para recibir peticiones!\n');
});
