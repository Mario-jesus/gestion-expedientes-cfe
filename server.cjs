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
// FUNCIONES HELPER PARA COLABORADORES
// ============================================

/**
 * Calcula el estado del expediente basado en los documentos
 */
function calculateExpedienteStatus(documents) {
  const activeDocuments = documents.filter((doc) => doc.isActive);

  const hasBateria = activeDocuments.some((doc) => doc.kind === 'bateria');
  const hasHistorial = activeDocuments.some((doc) => doc.kind === 'historial');
  const hasPerfil = activeDocuments.some((doc) => doc.kind === 'perfil');
  const hasConstancias = activeDocuments.some((doc) => doc.kind === 'constancia');
  const hasOtros = activeDocuments.some((doc) => doc.kind === 'otro');

  const documentosRequeridos = ['bateria', 'historial', 'perfil'];
  const documentosCompletos = documentosRequeridos.filter((kind) => {
    return activeDocuments.some((doc) => doc.kind === kind);
  }).length;

  let status;
  if (activeDocuments.length === 0) {
    status = 'sin_documentos';
  } else if (documentosCompletos === documentosRequeridos.length) {
    status = 'completo';
  } else {
    status = 'incompleto';
  }

  return status;
}

// ============================================
// ENDPOINTS PERSONALIZADOS DE COLABORADORES
// ============================================

/**
 * GET /collaborators
 * Lista colaboradores con filtros avanzados
 */
server.get('/collaborators', (req, res) => {
  const db = router.db;
  let collaborators = db.get('collaborators').value();

  // Aplicar filtros
  const { q, areaId, adscripcionId, puestoId, tipoContrato, isActive, estadoExpediente } = req.query;

  // Filtro de búsqueda (nombre, apellidos, RPE)
  if (q) {
    const searchLower = q.toLowerCase();
    collaborators = collaborators.filter((c) => {
      return (
        c.nombre.toLowerCase().includes(searchLower) ||
        c.apellidos.toLowerCase().includes(searchLower) ||
        c.rpe.toLowerCase().includes(searchLower)
      );
    });
  }

  // Filtro por área
  if (areaId) {
    collaborators = collaborators.filter((c) => c.areaId === areaId);
  }

  // Filtro por adscripción
  if (adscripcionId) {
    collaborators = collaborators.filter((c) => c.adscripcionId === adscripcionId);
  }

  // Filtro por puesto
  if (puestoId) {
    collaborators = collaborators.filter((c) => c.puestoId === puestoId);
  }

  // Filtro por tipo de contrato
  if (tipoContrato) {
    collaborators = collaborators.filter((c) => c.tipoContrato === tipoContrato);
  }

  // Filtro por estado activo
  if (isActive !== undefined) {
    const isActiveBool = isActive === 'true';
    collaborators = collaborators.filter((c) => c.isActive === isActiveBool);
  }

  // Filtro por estado del expediente (requiere calcular estado para cada colaborador)
  if (estadoExpediente) {
    const documents = db.get('documents').value();
    collaborators = collaborators.filter((c) => {
      const collaboratorDocuments = documents.filter(
        (d) => d.collaboratorId === c.id
      );
      const status = calculateExpedienteStatus(collaboratorDocuments);
      return status === estadoExpediente;
    });
  }

  res.status(200).json(collaborators);
});

/**
 * POST /collaborators/:id/toggle-status
 * Alterna el estado activo/inactivo del colaborador
 */
server.post('/collaborators/:id/toggle-status', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const collaborator = db.get('collaborators').find({ id }).value();

  if (!collaborator) {
    return res.status(404).json({
      error: 'Colaborador no encontrado',
    });
  }

  // Alternar el estado
  const updatedCollaborator = {
    ...collaborator,
    isActive: !collaborator.isActive,
    updatedAt: new Date().toISOString(),
  };

  db.get('collaborators').find({ id }).assign(updatedCollaborator).write();

  res.status(200).json(updatedCollaborator);
});

/**
 * GET /collaborators/:id/documents
 * Obtiene todos los documentos de un colaborador
 */
server.get('/collaborators/:id/documents', (req, res) => {
  const { id } = req.params;
  const db = router.db;

  // Verificar que el colaborador existe
  const collaborator = db.get('collaborators').find({ id }).value();
  if (!collaborator) {
    return res.status(404).json({
      error: 'Colaborador no encontrado',
    });
  }

  // Obtener documentos del colaborador
  const documents = db
    .get('documents')
    .filter({ collaboratorId: id })
    .value();

  res.status(200).json(documents);
});

// ============================================
// ENDPOINTS DE DOCUMENTOS
// ============================================

/**
 * POST /collaborators
 * Crear colaborador con validaciones
 */
server.post('/collaborators', (req, res) => {
  const db = router.db;
  const { rpe, rfc, curp, imss } = req.body;

  // Validar campos requeridos
  if (!rpe || !rfc || !curp || !imss) {
    return res.status(400).json({
      error: 'RPE, RFC, CURP e IMSS son campos requeridos',
    });
  }

  // Validar que el RPE sea único
  const existingCollaborator = db.get('collaborators').find({ rpe }).value();
  if (existingCollaborator) {
    return res.status(400).json({
      error: 'Ya existe un colaborador con este RPE',
    });
  }

  // Agregar campos de auditoría
  const now = new Date().toISOString();
  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader) {
    const tokenMatch = authHeader.match(/mock-jwt-token-(\d+)-/);
    if (tokenMatch) {
      userId = tokenMatch[1];
    }
  }

  const newCollaborator = {
    ...req.body,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    createdAt: now,
    updatedAt: now,
    createdBy: userId || 'system',
  };

  // Guardar colaborador
  const collaborator = db.get('collaborators').insert(newCollaborator).write();

  // Crear log de auditoría
  if (userId) {
    db.get('logs').insert({
      userId,
      action: 'create',
      entity: 'collaborator',
      entityId: collaborator.id,
      metadata: {
        nombre: collaborator.nombre,
        apellidos: collaborator.apellidos,
        rpe: collaborator.rpe,
      },
      createdAt: now,
    }).write();
  }

  res.status(201).json(collaborator);
});

/**
 * POST /documents
 * Crear documento con auditoría automática y validaciones
 */
server.post('/documents', (req, res) => {
  const db = router.db;
  const { collaboratorId, kind, fileName } = req.body;

  // Validar campos requeridos
  if (!collaboratorId || !kind || !fileName) {
    return res.status(400).json({
      error: 'collaboratorId, kind y fileName son campos requeridos',
    });
  }

  // Validar que el colaborador existe
  const collaborator = db.get('collaborators').find({ id: collaboratorId }).value();
  if (!collaborator) {
    return res.status(404).json({
      error: 'Colaborador no encontrado',
    });
  }

  // Validar que el kind sea válido
  const validKinds = ['bateria', 'historial', 'perfil', 'constancia', 'otro'];
  if (!validKinds.includes(kind)) {
    return res.status(400).json({
      error: `kind debe ser uno de: ${validKinds.join(', ')}`,
    });
  }

  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader) {
    const tokenMatch = authHeader.match(/mock-jwt-token-(\d+)-/);
    if (tokenMatch) {
      userId = tokenMatch[1];
    }
  }

  // Agregar campos de auditoría
  const now = new Date().toISOString();
  const newDocument = {
    ...req.body,
    uploadedBy: userId || 'system',
    uploadedAt: now,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    createdAt: now,
    updatedAt: now,
  };

  // Guardar documento
  const document = db.get('documents').insert(newDocument).write();

  // Crear log de auditoría
  if (userId) {
    db.get('logs').insert({
      userId,
      action: 'upload',
      entity: 'document',
      entityId: document.id,
      metadata: {
        fileName: document.fileName,
        kind: document.kind,
        collaboratorId: document.collaboratorId,
      },
      createdAt: now,
    }).write();
  }

  res.status(201).json(document);
});

// ============================================
// ENDPOINTS DE CATÁLOGOS
// ============================================

/**
 * GET /areas/:id/adscripciones
 * Obtiene adscripciones de un área específica
 */
server.get('/areas/:id/adscripciones', (req, res) => {
  const { id } = req.params;
  const db = router.db;

  // Verificar que el área existe
  const area = db.get('areas').find({ id }).value();
  if (!area) {
    return res.status(404).json({
      error: 'Área no encontrada',
    });
  }

  // Obtener adscripciones del área
  const adscripciones = db
    .get('adscripciones')
    .filter({ areaId: id })
    .value();

  res.status(200).json(adscripciones);
});

/**
 * GET /documentTypes
 * Obtiene tipos de documento, opcionalmente filtrados por kind
 */
server.get('/documentTypes', (req, res) => {
  const db = router.db;
  let documentTypes = db.get('documentTypes').value();

  // Filtro por kind si se proporciona
  const { kind } = req.query;
  if (kind) {
    documentTypes = documentTypes.filter((dt) => dt.kind === kind);
  }

  res.status(200).json(documentTypes);
});

// ============================================
// ENDPOINTS DE REPORTES
// ============================================

/**
 * GET /reports/summary
 * Obtiene resumen de expedientes (estadísticas)
 */
server.get('/reports/summary', (req, res) => {
  const db = router.db;
  const { areaId } = req.query;

  const collaborators = db.get('collaborators').value();
  const documents = db.get('documents').value();
  const areas = db.get('areas').value();

  // Filtrar colaboradores por área si se especifica
  let filteredCollaborators = collaborators;
  if (areaId) {
    filteredCollaborators = collaborators.filter((c) => c.areaId === areaId);
  }

  // Calcular estadísticas
  let completos = 0;
  let incompletos = 0;
  let sinDocumentos = 0;

  const porArea = {};

  filteredCollaborators.forEach((collaborator) => {
    const collaboratorDocuments = documents.filter(
      (d) => d.collaboratorId === collaborator.id
    );
    const status = calculateExpedienteStatus(collaboratorDocuments);

    if (status === 'completo') {
      completos++;
    } else if (status === 'incompleto') {
      incompletos++;
    } else {
      sinDocumentos++;
    }

    // Estadísticas por área
    if (!porArea[collaborator.areaId]) {
      porArea[collaborator.areaId] = {
        total: 0,
        completos: 0,
        incompletos: 0,
      };
    }

    porArea[collaborator.areaId].total++;
    if (status === 'completo') {
      porArea[collaborator.areaId].completos++;
    } else if (status === 'incompleto') {
      porArea[collaborator.areaId].incompletos++;
    }
  });

  // Agregar nombres de áreas al resultado
  const porAreaConNombres = {};
  Object.keys(porArea).forEach((areaId) => {
    const area = areas.find((a) => a.id === areaId);
    porAreaConNombres[areaId] = {
      ...porArea[areaId],
      areaNombre: area ? area.nombre : 'Desconocida',
    };
  });

  res.status(200).json({
    totalColaboradores: filteredCollaborators.length,
    completos,
    incompletos,
    sinDocumentos,
    porArea: porAreaConNombres,
  });
});

// ============================================
// ENDPOINTS DE MINUTAS
// ============================================

/**
 * GET /minutes
 * Lista minutas con filtros avanzados
 */
server.get('/minutes', (req, res) => {
  const db = router.db;
  let minutes = db.get('minutes').value();

  // Aplicar filtros
  const { q, tipo, fechaDesde, fechaHasta, isActive } = req.query;

  // Filtro de búsqueda (título o descripción)
  if (q) {
    const searchLower = q.toLowerCase();
    minutes = minutes.filter((m) => {
      return (
        m.titulo.toLowerCase().includes(searchLower) ||
        (m.descripcion && m.descripcion.toLowerCase().includes(searchLower))
      );
    });
  }

  // Filtro por tipo
  if (tipo) {
    minutes = minutes.filter((m) => m.tipo === tipo);
  }

  // Filtro por fecha desde
  if (fechaDesde) {
    minutes = minutes.filter((m) => m.fecha >= fechaDesde);
  }

  // Filtro por fecha hasta
  if (fechaHasta) {
    minutes = minutes.filter((m) => m.fecha <= fechaHasta);
  }

  // Filtro por estado activo
  if (isActive !== undefined) {
    const isActiveBool = isActive === 'true';
    minutes = minutes.filter((m) => m.isActive === isActiveBool);
  }

  res.status(200).json(minutes);
});

/**
 * GET /minutes/:id
 * Obtiene una minuta por ID (CRUD estándar de JSON Server)
 */

/**
 * POST /minutes
 * Crear/subir una nueva minuta con validaciones y auditoría
 */
server.post('/minutes', (req, res) => {
  const db = router.db;
  const { titulo, tipo, fecha, fileName } = req.body;

  // Validar campos requeridos
  if (!titulo || !tipo || !fecha || !fileName) {
    return res.status(400).json({
      error: 'titulo, tipo, fecha y fileName son campos requeridos',
    });
  }

  // Validar que el tipo sea válido
  const validTypes = ['reunion', 'junta', 'acuerdo', 'memorandum', 'otro'];
  if (!validTypes.includes(tipo)) {
    return res.status(400).json({
      error: `tipo debe ser uno de: ${validTypes.join(', ')}`,
    });
  }

  // Validar formato de fecha
  if (isNaN(Date.parse(fecha))) {
    return res.status(400).json({
      error: 'fecha debe ser una fecha válida en formato ISO',
    });
  }

  const authHeader = req.headers.authorization;
  let userId = null;
  if (authHeader) {
    const tokenMatch = authHeader.match(/mock-jwt-token-(\d+)-/);
    if (tokenMatch) {
      userId = tokenMatch[1];
    }
  }

  // Agregar campos de auditoría
  const now = new Date().toISOString();
  const newMinute = {
    ...req.body,
    uploadedBy: userId || 'system',
    uploadedAt: now,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    createdAt: now,
    updatedAt: now,
  };

  // Guardar minuta
  const minute = db.get('minutes').insert(newMinute).write();

  // Crear log de auditoría
  if (userId) {
    db.get('logs').insert({
      userId,
      action: 'upload',
      entity: 'minute',
      entityId: minute.id,
      metadata: {
        fileName: minute.fileName,
        tipo: minute.tipo,
        titulo: minute.titulo,
      },
      createdAt: now,
    }).write();
  }

  res.status(201).json(minute);
});

/**
 * PUT /minutes/:id
 * Actualiza una minuta (CRUD estándar de JSON Server)
 */

/**
 * DELETE /minutes/:id
 * Elimina una minuta (baja lógica, CRUD estándar de JSON Server)
 */

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
  console.log('\n   Colaboradores:');
  console.log('   GET    /collaborators (con filtros: q, areaId, adscripcionId, puestoId, tipoContrato, isActive, estadoExpediente)');
  console.log('   GET    /collaborators/:id');
  console.log('   POST   /collaborators');
  console.log('   PUT    /collaborators/:id');
  console.log('   DELETE /collaborators/:id');
  console.log('   POST   /collaborators/:id/toggle-status');
  console.log('   GET    /collaborators/:id/documents');
  console.log('\n   Documentos:');
  console.log('   GET    /documents');
  console.log('   GET    /documents/:id');
  console.log('   POST   /documents');
  console.log('   PUT    /documents/:id');
  console.log('   DELETE /documents/:id');
  console.log('\n   Catálogos:');
  console.log('   GET    /areas');
  console.log('   GET    /areas/:id/adscripciones');
  console.log('   GET    /adscripciones');
  console.log('   GET    /puestos');
  console.log('   GET    /documentTypes (con filtro opcional: ?kind=otro)');
  console.log('\n   Minutas:');
  console.log('   GET    /minutes (con filtros: q, tipo, fechaDesde, fechaHasta, isActive)');
  console.log('   GET    /minutes/:id');
  console.log('   POST   /minutes');
  console.log('   PUT    /minutes/:id');
  console.log('   DELETE /minutes/:id');
  console.log('\n   Reportes:');
  console.log('   GET    /reports/summary (con filtro opcional: ?areaId=1)');
  console.log('\n✨ Listo para recibir peticiones!\n');
});
