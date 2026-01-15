/**
 * Servidor JSON Server con endpoints personalizados
 * Refactorizado para ser compatible con la API real
 * Todos los endpoints incluyen el prefijo /api
 */

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');

// Middleware para parsear JSON
server.use(jsonServer.bodyParser);
server.use(middlewares);

/**
 * Middleware para parsear multipart/form-data usando busboy
 * Nota: Requiere instalar busboy: npm install busboy
 * Si busboy no está disponible, el servidor funcionará pero no procesará FormData real
 */
function parseMultipart(req, res, next) {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    const busboy = Busboy({ headers: req.headers });
    const fields = {};
    const files = {};

    busboy.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;
      let fileData = Buffer.alloc(0);
      
      file.on('data', (data) => {
        fileData = Buffer.concat([fileData, data]);
      });

      file.on('end', () => {
        files[fieldname] = {
          filename,
          encoding,
          mimeType,
          size: fileData.length,
          buffer: fileData,
        };
      });
    });

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('finish', () => {
      req.body = { ...fields, ...files };
      req.files = files;
      next();
    });

    req.pipe(busboy);
  } else {
    next();
  }
}

// Usar el middleware solo si busboy está disponible
try {
  require.resolve('busboy');
  server.use(parseMultipart);
} catch (e) {
  console.warn('⚠️  busboy no está instalado. Para soporte completo de FormData, ejecuta: npm install busboy');
  console.warn('   El servidor funcionará pero los uploads de archivos serán simulados.\n');
}

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ============================================
// FUNCIONES HELPER
// ============================================

/**
 * Extrae el userId del token de autorización
 */
function getUserIdFromToken(authHeader) {
  if (!authHeader) return null;
  const tokenMatch = authHeader.match(/Bearer\s+mock-jwt-token-(\d+)-/);
  return tokenMatch ? tokenMatch[1] : null;
}

/**
 * Calcula el estado del expediente basado en los documentos
 */
function calculateExpedienteStatus(documents) {
  const activeDocuments = documents.filter((doc) => doc.isActive);

  const hasBateria = activeDocuments.some((doc) => doc.kind === 'bateria');
  const hasHistorial = activeDocuments.some((doc) => doc.kind === 'historial');
  const hasPerfil = activeDocuments.some((doc) => doc.kind === 'perfil');
  const hasConstancias = activeDocuments.some((doc) => doc.kind === 'constancia');
  const hasCchl = activeDocuments.some((doc) => doc.kind === 'cchl');

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

/**
 * Crea una respuesta paginada
 */
function createPaginatedResponse(data, limit = 20, offset = 0) {
  const total = data.length;
  const paginatedData = data.slice(offset, offset + limit);
  const totalPages = Math.ceil(total / limit);

  return {
    data: paginatedData,
    pagination: {
      total,
      limit: Number(limit),
      offset: Number(offset),
      totalPages,
    },
  };
}

/**
 * Crea un log de auditoría
 */
function createAuditLog(db, userId, action, entity, entityId, details = {}) {
  if (!userId) return;

  const now = new Date().toISOString();
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    action,
    entity,
    entityId,
    details,
    ipAddress: '127.0.0.1',
    userAgent: 'Mock Server',
    createdAt: now,
  };

  // Guardar en logs (compatibilidad) y audit (nuevo)
  db.get('logs').insert(log).write();
  db.get('audit').insert(log).write();
}

// ============================================
// ENDPOINTS DE AUTENTICACIÓN
// ============================================

/**
 * POST /api/auth/login
 */
server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Username y password son requeridos',
      code: 'VALIDATION_ERROR',
    });
  }

  const db = router.db;
  const user = db.get('users').find({ username }).value();

  if (!user) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
      code: 'INVALID_CREDENTIALS',
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      error: 'Tu cuenta está desactivada. Contacta al administrador.',
      code: 'ACCOUNT_DISABLED',
    });
  }

  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;
  const expiresIn = 3600; // 1 hora

  // Crear log de login
  createAuditLog(db, user.id, 'login', 'User', user.id);

  res.status(200).json({
    token,
    refreshToken,
    expiresIn,
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
 * POST /api/auth/logout
 */
server.post('/api/auth/logout', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  const db = router.db;

  if (userId) {
    createAuditLog(db, userId, 'logout', 'User', userId);
  }

  res.status(200).json({
    message: 'Logout exitoso',
  });
});

/**
 * GET /api/auth/me
 */
server.get('/api/auth/me', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);

  if (!userId) {
    return res.status(401).json({
      error: 'Token no proporcionado',
      code: 'UNAUTHORIZED',
    });
  }

  const db = router.db;
  const user = db.get('users').find({ id: userId }).value();

  if (!user) {
    return res.status(401).json({
      error: 'Usuario no encontrado',
      code: 'UNAUTHORIZED',
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      error: 'Tu cuenta está desactivada. Contacta al administrador.',
      code: 'ACCOUNT_DISABLED',
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
    },
  });
});

/**
 * POST /api/auth/refresh
 * Implementa rotación de tokens
 */
server.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      error: 'Refresh token no proporcionado',
      code: 'MISSING_REFRESH_TOKEN',
    });
  }

  // Extraer userId del refresh token
  const tokenMatch = refreshToken.match(/mock-refresh-token-(\d+)-/);
  
  if (!tokenMatch) {
    return res.status(401).json({
      error: 'Refresh token inválido',
      code: 'INVALID_REFRESH_TOKEN',
    });
  }

  const userId = tokenMatch[1];
  const db = router.db;
  const user = db.get('users').find({ id: userId }).value();

  if (!user || !user.isActive) {
    return res.status(401).json({
      error: 'Refresh token inválido',
      code: 'INVALID_REFRESH_TOKEN',
    });
  }

  // Generar nuevos tokens (rotación)
  const newToken = `mock-jwt-token-${userId}-${Date.now()}`;
  const newRefreshToken = `mock-refresh-token-${userId}-${Date.now()}`;
  const expiresIn = 3600;

  // Crear log de refresh
  createAuditLog(db, userId, 'refresh_token', 'User', userId);

  res.status(200).json({
    token: newToken,
    refreshToken: newRefreshToken,
    expiresIn,
  });
});

// ============================================
// ENDPOINTS DE USUARIOS
// ============================================

/**
 * GET /api/users
 * Lista usuarios con paginación
 */
server.get('/api/users', (req, res) => {
  const db = router.db;
  let users = db.get('users').value();

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  // Aplicar filtros si existen
  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    users = users.filter((u) => u.isActive === isActive);
  }

  const response = createPaginatedResponse(users, limit, offset);
  res.status(200).json(response);
});

/**
 * PATCH /api/users/me
 * Actualiza el perfil del usuario actual
 */
server.patch('/api/users/me', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);

  if (!userId) {
    return res.status(401).json({
      error: 'No autenticado',
      code: 'UNAUTHORIZED',
    });
  }

  const db = router.db;
  const user = db.get('users').find({ id: userId }).value();

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
      code: 'USER_NOT_FOUND',
    });
  }

  const { name, email } = req.body;
  const updatedUser = {
    ...user,
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    updatedAt: new Date().toISOString(),
  };

  db.get('users').find({ id: userId }).assign(updatedUser).write();

  createAuditLog(db, userId, 'update', 'User', userId, { field: 'profile' });

  res.status(200).json(updatedUser);
});

/**
 * GET /api/users/me/activity
 * Obtiene el historial de actividad del usuario actual
 */
server.get('/api/users/me/activity', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);

  if (!userId) {
    return res.status(401).json({
      error: 'No autenticado',
      code: 'UNAUTHORIZED',
    });
  }

  const db = router.db;
  let logs = db.get('audit').filter({ userId }).value();

  // Ordenar por fecha más reciente primero
  logs = logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(logs, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/users/:id/activate
 */
server.post('/api/users/:id/activate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const user = db.get('users').find({ id }).value();

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
      code: 'USER_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updatedUser = {
    ...user,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  db.get('users').find({ id }).assign(updatedUser).write();

  if (userId) {
    createAuditLog(db, userId, 'activate', 'User', id);
  }

  res.status(200).json(updatedUser);
});

/**
 * POST /api/users/:id/deactivate
 */
server.post('/api/users/:id/deactivate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const user = db.get('users').find({ id }).value();

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
      code: 'USER_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updatedUser = {
    ...user,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  db.get('users').find({ id }).assign(updatedUser).write();

  if (userId) {
    createAuditLog(db, userId, 'deactivate', 'User', id);
  }

  res.status(200).json(updatedUser);
});

/**
 * POST /api/users/:id/change-password
 */
server.post('/api/users/:id/change-password', (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'currentPassword y newPassword son requeridos',
      code: 'VALIDATION_ERROR',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: 'La nueva contraseña debe tener al menos 6 caracteres',
      code: 'VALIDATION_ERROR',
    });
  }

  const db = router.db;
  const user = db.get('users').find({ id }).value();

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
      code: 'USER_NOT_FOUND',
    });
  }

  // En un mock, no validamos currentPassword realmente
  // En producción, se validaría con bcrypt

  const userId = getUserIdFromToken(req.headers.authorization);
  const updatedUser = {
    ...user,
    updatedAt: new Date().toISOString(),
  };

  db.get('users').find({ id }).assign(updatedUser).write();

  if (userId) {
    createAuditLog(db, userId, 'change_password', 'User', id);
  }

  res.status(200).json({
    message: 'Contraseña actualizada exitosamente',
    id: user.id,
    updatedAt: updatedUser.updatedAt,
  });
});

// ============================================
// ENDPOINTS DE COLABORADORES
// ============================================

/**
 * GET /api/collaborators
 * Lista colaboradores con filtros y paginación
 */
server.get('/api/collaborators', (req, res) => {
  const db = router.db;
  let collaborators = db.get('collaborators').value();

  // Aplicar filtros
  const { search, areaId, adscripcionId, puestoId, tipoContrato, isActive, estadoExpediente } = req.query;

  // Filtro de búsqueda (nombre, apellidos, RPE) - ahora usa 'search' en lugar de 'q'
  if (search) {
    const searchLower = search.toLowerCase();
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

  // Filtro por estado del expediente
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

  // Ordenamiento
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder || 'desc';
  collaborators.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(collaborators, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/collaborators/:id/activate
 */
server.post('/api/collaborators/:id/activate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const collaborator = db.get('collaborators').find({ id }).value();

  if (!collaborator) {
    return res.status(404).json({
      error: 'Colaborador no encontrado',
      code: 'COLLABORATOR_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updatedCollaborator = {
    ...collaborator,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  db.get('collaborators').find({ id }).assign(updatedCollaborator).write();

  if (userId) {
    createAuditLog(db, userId, 'activate', 'Collaborator', id);
  }

  res.status(200).json(updatedCollaborator);
});

/**
 * POST /api/collaborators/:id/deactivate
 */
server.post('/api/collaborators/:id/deactivate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const collaborator = db.get('collaborators').find({ id }).value();

  if (!collaborator) {
    return res.status(404).json({
      error: 'Colaborador no encontrado',
      code: 'COLLABORATOR_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updatedCollaborator = {
    ...collaborator,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  db.get('collaborators').find({ id }).assign(updatedCollaborator).write();

  if (userId) {
    createAuditLog(db, userId, 'deactivate', 'Collaborator', id);
  }

  res.status(200).json(updatedCollaborator);
});

/**
 * GET /api/collaborators/:id/documents
 * Obtiene documentos de un colaborador
 */
server.get('/api/collaborators/:id/documents', (req, res) => {
  const { id } = req.params;
  const db = router.db;

  const collaborator = db.get('collaborators').find({ id }).value();
  if (!collaborator) {
    return res.status(404).json({
      error: 'Colaborador no encontrado',
      code: 'COLLABORATOR_NOT_FOUND',
    });
  }

  let documents = db.get('documents').filter({ collaboratorId: id }).value();

  // Aplicar filtros
  if (req.query.kind) {
    documents = documents.filter((d) => d.kind === req.query.kind);
  }

  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    documents = documents.filter((d) => d.isActive === isActive);
  }

  res.status(200).json({
    data: documents,
    total: documents.length,
  });
});

/**
 * POST /api/collaborators
 * Crear colaborador con validaciones
 */
server.post('/api/collaborators', (req, res) => {
  const db = router.db;
  const { rpe, rfc, curp, imss } = req.body;

  if (!rpe || !rfc || !curp || !imss) {
    return res.status(400).json({
      error: 'RPE, RFC, CURP e IMSS son campos requeridos',
      code: 'VALIDATION_ERROR',
    });
  }

  const existingCollaborator = db.get('collaborators').find({ rpe }).value();
  if (existingCollaborator) {
    return res.status(409).json({
      error: 'Ya existe un colaborador con este RPE',
      code: 'DUPLICATE_RPE',
    });
  }

  const now = new Date().toISOString();
  const userId = getUserIdFromToken(req.headers.authorization);

  const newCollaborator = {
    ...req.body,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    createdAt: now,
    updatedAt: now,
    createdBy: userId || 'system',
  };

  const collaborator = db.get('collaborators').insert(newCollaborator).write();

  if (userId) {
    createAuditLog(db, userId, 'create', 'Collaborator', collaborator.id, {
      nombre: collaborator.nombre,
      apellidos: collaborator.apellidos,
      rpe: collaborator.rpe,
    });
  }

  res.status(201).json(collaborator);
});

// ============================================
// ENDPOINTS DE DOCUMENTOS
// ============================================

/**
 * GET /api/documents
 * Lista documentos con filtros y paginación
 */
server.get('/api/documents', (req, res) => {
  const db = router.db;
  let documents = db.get('documents').value();

  // Aplicar filtros
  if (req.query.collaboratorId) {
    documents = documents.filter((d) => d.collaboratorId === req.query.collaboratorId);
  }

  if (req.query.kind) {
    documents = documents.filter((d) => d.kind === req.query.kind);
  }

  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    documents = documents.filter((d) => d.isActive === isActive);
  }

  if (req.query.documentTypeId) {
    documents = documents.filter((d) => d.documentTypeId === req.query.documentTypeId);
  }

  // Ordenamiento
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder || 'desc';
  documents.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'createdAt' || sortBy === 'uploadedAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(documents, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/documents
 * Crear documento con multipart/form-data
 */
server.post('/api/documents', (req, res) => {
  const db = router.db;
  
  // Manejar FormData o JSON
  let collaboratorId, kind, periodo, descripcion, documentTypeId;
  let fileName, fileSize, fileType;

  if (req.files && req.files.file) {
    // Datos vienen de FormData (busboy)
    const file = req.files.file;
    collaboratorId = req.body.collaboratorId;
    kind = req.body.kind;
    periodo = req.body.periodo;
    descripcion = req.body.descripcion;
    documentTypeId = req.body.documentTypeId;
    fileName = file.filename;
    fileSize = file.size;
    fileType = file.mimeType;
  } else {
    // Datos vienen como JSON (fallback para mock sin busboy)
    ({ collaboratorId, kind, periodo, descripcion, documentTypeId, fileName, fileSize, fileType } = req.body);
    fileName = fileName || `documento_${kind}_${Date.now()}.pdf`;
  }

  if (!collaboratorId || !kind) {
    return res.status(400).json({
      error: 'collaboratorId y kind son campos requeridos',
      code: 'VALIDATION_ERROR',
    });
  }

  if (!fileName && !req.files?.file) {
    return res.status(400).json({
      error: 'Archivo requerido',
      code: 'VALIDATION_ERROR',
    });
  }

  const collaborator = db.get('collaborators').find({ id: collaboratorId }).value();
  if (!collaborator) {
    return res.status(404).json({
      error: 'Colaborador no encontrado',
      code: 'COLLABORATOR_NOT_FOUND',
    });
  }

  const validKinds = ['perfil', 'bateria', 'historial', 'cchl', 'c0_03', 'constancia'];
  if (!validKinds.includes(kind)) {
    return res.status(400).json({
      error: `kind debe ser uno de: ${validKinds.join(', ')}`,
      code: 'VALIDATION_ERROR',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const now = new Date().toISOString();

  // Generar URL para el archivo
  const fileUrl = `/uploads/documents/${fileName}`;

  const newDocument = {
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    collaboratorId,
    kind,
    fileName,
    fileUrl,
    fileSize: fileSize || 0,
    fileType: fileType || 'application/pdf',
    periodo: periodo || null,
    descripcion: descripcion || null,
    documentTypeId: documentTypeId || null,
    uploadedBy: userId || 'system',
    uploadedAt: now,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const document = db.get('documents').insert(newDocument).write();

  if (userId) {
    createAuditLog(db, userId, 'upload', 'Document', document.id, {
      fileName: document.fileName,
      kind: document.kind,
      collaboratorId: document.collaboratorId,
    });
  }

  res.status(201).json(document);
});

/**
 * GET /api/documents/:id/download
 */
server.get('/api/documents/:id/download', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const document = db.get('documents').find({ id }).value();

  if (!document) {
    return res.status(404).json({
      error: 'Documento no encontrado',
      code: 'DOCUMENT_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  if (userId) {
    createAuditLog(db, userId, 'download', 'Document', id, {
      fileName: document.fileName,
    });
  }

  // En un mock, retornamos la URL del archivo
  // En producción, esto serviría el archivo real
  res.status(200).json({
    url: `http://localhost:${process.env.PORT || 3001}${document.fileUrl}`,
    fileName: document.fileName,
  });
});

// ============================================
// ENDPOINTS DE MINUTAS
// ============================================

/**
 * GET /api/minutes
 * Lista minutas con filtros y paginación
 */
server.get('/api/minutes', (req, res) => {
  const db = router.db;
  let minutes = db.get('minutes').value();

  // Aplicar filtros
  const { search, tipo, fechaDesde, fechaHasta, isActive } = req.query;

  // Filtro de búsqueda (ahora usa 'search' en lugar de 'q')
  if (search) {
    const searchLower = search.toLowerCase();
    minutes = minutes.filter((m) => {
      return (
        m.titulo.toLowerCase().includes(searchLower) ||
        (m.descripcion && m.descripcion.toLowerCase().includes(searchLower))
      );
    });
  }

  if (tipo) {
    minutes = minutes.filter((m) => m.tipo === tipo);
  }

  if (fechaDesde) {
    minutes = minutes.filter((m) => m.fecha >= fechaDesde);
  }

  if (fechaHasta) {
    minutes = minutes.filter((m) => m.fecha <= fechaHasta);
  }

  if (isActive !== undefined) {
    const isActiveBool = isActive === 'true';
    minutes = minutes.filter((m) => m.isActive === isActiveBool);
  }

  // Ordenamiento
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder || 'desc';
  minutes.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'createdAt' || sortBy === 'fecha' || sortBy === 'uploadedAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(minutes, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/minutes
 * Crear minuta con multipart/form-data
 */
server.post('/api/minutes', (req, res) => {
  const db = router.db;
  
  // Manejar FormData o JSON
  let titulo, tipo, fecha, descripcion;
  let fileName, fileSize, fileType;

  if (req.files && req.files.file) {
    // Datos vienen de FormData (busboy)
    const file = req.files.file;
    titulo = req.body.titulo;
    tipo = req.body.tipo;
    fecha = req.body.fecha;
    descripcion = req.body.descripcion;
    fileName = file.filename;
    fileSize = file.size;
    fileType = file.mimeType;
  } else {
    // Datos vienen como JSON (fallback para mock sin busboy)
    ({ titulo, tipo, fecha, descripcion, fileName, fileSize, fileType } = req.body);
    fileName = fileName || `minuta_${tipo}_${Date.now()}.pdf`;
  }

  if (!titulo || !tipo || !fecha) {
    return res.status(400).json({
      error: 'titulo, tipo y fecha son campos requeridos',
      code: 'VALIDATION_ERROR',
    });
  }

  if (!fileName && !req.files?.file) {
    return res.status(400).json({
      error: 'Archivo requerido',
      code: 'VALIDATION_ERROR',
    });
  }

  const validTypes = ['reunion', 'junta', 'acuerdo', 'memorandum', 'otro'];
  if (!validTypes.includes(tipo)) {
    return res.status(400).json({
      error: `tipo debe ser uno de: ${validTypes.join(', ')}`,
      code: 'VALIDATION_ERROR',
    });
  }

  if (isNaN(Date.parse(fecha))) {
    return res.status(400).json({
      error: 'fecha debe ser una fecha válida en formato ISO',
      code: 'VALIDATION_ERROR',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const now = new Date().toISOString();

  // Generar URL para el archivo
  const fileUrl = `/uploads/minutes/${fileName}`;

  const newMinute = {
    id: `minute-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    titulo,
    tipo,
    fecha,
    descripcion: descripcion || null,
    fileName,
    fileUrl,
    fileSize: fileSize || 0,
    fileType: fileType || 'application/pdf',
    uploadedBy: userId || 'system',
    uploadedAt: now,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const minute = db.get('minutes').insert(newMinute).write();

  if (userId) {
    createAuditLog(db, userId, 'upload', 'Minute', minute.id, {
      fileName: minute.fileName,
      tipo: minute.tipo,
      titulo: minute.titulo,
    });
  }

  res.status(201).json(minute);
});

/**
 * GET /api/minutes/:id/download
 */
server.get('/api/minutes/:id/download', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const minute = db.get('minutes').find({ id }).value();

  if (!minute) {
    return res.status(404).json({
      error: 'Minuta no encontrada',
      code: 'MINUTE_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  if (userId) {
    createAuditLog(db, userId, 'download', 'Minute', id, {
      fileName: minute.fileName,
    });
  }

  res.status(200).json({
    url: `http://localhost:${process.env.PORT || 3001}${minute.fileUrl}`,
    fileName: minute.fileName,
  });
});

// ============================================
// ENDPOINTS DE CATÁLOGOS
// ============================================

/**
 * GET /api/catalogs/areas
 * Lista áreas con paginación
 */
server.get('/api/catalogs/areas', (req, res) => {
  const db = router.db;
  let areas = db.get('areas').value();

  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    areas = areas.filter((a) => a.isActive === isActive);
  }

  if (req.query.search) {
    const searchLower = req.query.search.toLowerCase();
    areas = areas.filter((a) => 
      a.nombre.toLowerCase().includes(searchLower) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(searchLower))
    );
  }

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(areas, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/catalogs/areas/:id/activate
 */
server.post('/api/catalogs/areas/:id/activate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const area = db.get('areas').find({ id }).value();

  if (!area) {
    return res.status(404).json({
      error: 'Área no encontrada',
      code: 'AREA_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updatedArea = {
    ...area,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  db.get('areas').find({ id }).assign(updatedArea).write();

  if (userId) {
    createAuditLog(db, userId, 'activate', 'Area', id);
  }

  res.status(200).json(updatedArea);
});

/**
 * POST /api/catalogs/areas/:id/deactivate
 */
server.post('/api/catalogs/areas/:id/deactivate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const area = db.get('areas').find({ id }).value();

  if (!area) {
    return res.status(404).json({
      error: 'Área no encontrada',
      code: 'AREA_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updatedArea = {
    ...area,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  db.get('areas').find({ id }).assign(updatedArea).write();

  if (userId) {
    createAuditLog(db, userId, 'deactivate', 'Area', id);
  }

  res.status(200).json(updatedArea);
});

/**
 * GET /api/catalogs/adscripciones
 */
server.get('/api/catalogs/adscripciones', (req, res) => {
  const db = router.db;
  let adscripciones = db.get('adscripciones').value();

  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    adscripciones = adscripciones.filter((a) => a.isActive === isActive);
  }

  if (req.query.search) {
    const searchLower = req.query.search.toLowerCase();
    adscripciones = adscripciones.filter((a) => 
      a.nombre.toLowerCase().includes(searchLower) ||
      (a.adscripcion && a.adscripcion.toLowerCase().includes(searchLower)) ||
      (a.descripcion && a.descripcion.toLowerCase().includes(searchLower))
    );
  }

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(adscripciones, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/catalogs/adscripciones/:id/activate
 */
server.post('/api/catalogs/adscripciones/:id/activate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const adscripcion = db.get('adscripciones').find({ id }).value();

  if (!adscripcion) {
    return res.status(404).json({
      error: 'Adscripción no encontrada',
      code: 'ADSCRIPCION_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updated = {
    ...adscripcion,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  db.get('adscripciones').find({ id }).assign(updated).write();

  if (userId) {
    createAuditLog(db, userId, 'activate', 'Adscripcion', id);
  }

  res.status(200).json(updated);
});

/**
 * POST /api/catalogs/adscripciones/:id/deactivate
 */
server.post('/api/catalogs/adscripciones/:id/deactivate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const adscripcion = db.get('adscripciones').find({ id }).value();

  if (!adscripcion) {
    return res.status(404).json({
      error: 'Adscripción no encontrada',
      code: 'ADSCRIPCION_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updated = {
    ...adscripcion,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  db.get('adscripciones').find({ id }).assign(updated).write();

  if (userId) {
    createAuditLog(db, userId, 'deactivate', 'Adscripcion', id);
  }

  res.status(200).json(updated);
});

/**
 * GET /api/catalogs/puestos
 */
server.get('/api/catalogs/puestos', (req, res) => {
  const db = router.db;
  let puestos = db.get('puestos').value();

  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    puestos = puestos.filter((p) => p.isActive === isActive);
  }

  if (req.query.search) {
    const searchLower = req.query.search.toLowerCase();
    puestos = puestos.filter((p) => 
      p.nombre.toLowerCase().includes(searchLower) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchLower))
    );
  }

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(puestos, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/catalogs/puestos/:id/activate
 */
server.post('/api/catalogs/puestos/:id/activate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const puesto = db.get('puestos').find({ id }).value();

  if (!puesto) {
    return res.status(404).json({
      error: 'Puesto no encontrado',
      code: 'PUESTO_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updated = {
    ...puesto,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  db.get('puestos').find({ id }).assign(updated).write();

  if (userId) {
    createAuditLog(db, userId, 'activate', 'Puesto', id);
  }

  res.status(200).json(updated);
});

/**
 * POST /api/catalogs/puestos/:id/deactivate
 */
server.post('/api/catalogs/puestos/:id/deactivate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const puesto = db.get('puestos').find({ id }).value();

  if (!puesto) {
    return res.status(404).json({
      error: 'Puesto no encontrado',
      code: 'PUESTO_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updated = {
    ...puesto,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  db.get('puestos').find({ id }).assign(updated).write();

  if (userId) {
    createAuditLog(db, userId, 'deactivate', 'Puesto', id);
  }

  res.status(200).json(updated);
});

/**
 * GET /api/catalogs/document-types
 */
server.get('/api/catalogs/document-types', (req, res) => {
  const db = router.db;
  let documentTypes = db.get('documentTypes').value();

  if (req.query.kind) {
    documentTypes = documentTypes.filter((dt) => dt.kind === req.query.kind);
  }

  if (req.query.isActive !== undefined) {
    const isActive = req.query.isActive === 'true';
    documentTypes = documentTypes.filter((dt) => dt.isActive === isActive);
  }

  if (req.query.search) {
    const searchLower = req.query.search.toLowerCase();
    documentTypes = documentTypes.filter((dt) => 
      dt.nombre.toLowerCase().includes(searchLower) ||
      (dt.descripcion && dt.descripcion.toLowerCase().includes(searchLower))
    );
  }

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(documentTypes, limit, offset);
  res.status(200).json(response);
});

/**
 * POST /api/catalogs/document-types/:id/activate
 */
server.post('/api/catalogs/document-types/:id/activate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const documentType = db.get('documentTypes').find({ id }).value();

  if (!documentType) {
    return res.status(404).json({
      error: 'Tipo de documento no encontrado',
      code: 'DOCUMENT_TYPE_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updated = {
    ...documentType,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  db.get('documentTypes').find({ id }).assign(updated).write();

  if (userId) {
    createAuditLog(db, userId, 'activate', 'DocumentType', id);
  }

  res.status(200).json(updated);
});

/**
 * POST /api/catalogs/document-types/:id/deactivate
 */
server.post('/api/catalogs/document-types/:id/deactivate', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const documentType = db.get('documentTypes').find({ id }).value();

  if (!documentType) {
    return res.status(404).json({
      error: 'Tipo de documento no encontrado',
      code: 'DOCUMENT_TYPE_NOT_FOUND',
    });
  }

  const userId = getUserIdFromToken(req.headers.authorization);
  const updated = {
    ...documentType,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  db.get('documentTypes').find({ id }).assign(updated).write();

  if (userId) {
    createAuditLog(db, userId, 'deactivate', 'DocumentType', id);
  }

  res.status(200).json(updated);
});

// ============================================
// ENDPOINTS DE AUDITORÍA
// ============================================

/**
 * GET /api/audit
 * Lista logs de auditoría con filtros y paginación
 */
server.get('/api/audit', (req, res) => {
  const db = router.db;
  let logs = db.get('audit').value();

  // Aplicar filtros
  if (req.query.userId) {
    logs = logs.filter((l) => l.userId === req.query.userId);
  }

  if (req.query.action) {
    logs = logs.filter((l) => l.action === req.query.action);
  }

  if (req.query.entity) {
    logs = logs.filter((l) => l.entity === req.query.entity);
  }

  if (req.query.entityId) {
    logs = logs.filter((l) => l.entityId === req.query.entityId);
  }

  if (req.query.fechaDesde) {
    logs = logs.filter((l) => l.createdAt >= req.query.fechaDesde);
  }

  if (req.query.fechaHasta) {
    logs = logs.filter((l) => l.createdAt <= req.query.fechaHasta);
  }

  // Ordenamiento
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder || 'desc';
  logs.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(logs, limit, offset);
  res.status(200).json(response);
});

/**
 * GET /api/audit/:id
 */
server.get('/api/audit/:id', (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const log = db.get('audit').find({ id }).value();

  if (!log) {
    return res.status(404).json({
      error: 'Log de auditoría no encontrado',
      code: 'AUDIT_LOG_NOT_FOUND',
    });
  }

  res.status(200).json(log);
});

/**
 * GET /api/audit/user/:userId
 */
server.get('/api/audit/user/:userId', (req, res) => {
  const { userId } = req.params;
  const db = router.db;

  const user = db.get('users').find({ id: userId }).value();
  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
      code: 'USER_NOT_FOUND',
    });
  }

  let logs = db.get('audit').filter({ userId }).value();

  // Ordenar por fecha más reciente primero
  logs = logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(logs, limit, offset);
  res.status(200).json(response);
});

/**
 * GET /api/audit/entity/:entity/:entityId
 */
server.get('/api/audit/entity/:entity/:entityId', (req, res) => {
  const { entity, entityId } = req.params;
  const db = router.db;

  let logs = db.get('audit').filter({ entity, entityId }).value();

  // Ordenar por fecha más reciente primero
  logs = logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const response = createPaginatedResponse(logs, limit, offset);
  res.status(200).json(response);
});

// ============================================
// ENDPOINTS DE REPORTES
// ============================================

/**
 * GET /api/reports/summary
 */
server.get('/api/reports/summary', (req, res) => {
  const db = router.db;
  const { areaId } = req.query;

  const collaborators = db.get('collaborators').value();
  const documents = db.get('documents').value();
  const areas = db.get('areas').value();

  let filteredCollaborators = collaborators;
  if (areaId) {
    filteredCollaborators = collaborators.filter((c) => c.areaId === areaId);
  }

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
// SERVIR ARCHIVOS ESTÁTICOS DE UPLOADS
// ============================================

server.use('/uploads', require('express').static('uploads'));

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
// Nota: JSON Server manejará automáticamente los endpoints con prefijo /api
// si están en db.json, pero necesitamos interceptar algunos antes
server.use('/api', router);

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log('\n🚀 JSON Server está corriendo en:');
  console.log(`   http://localhost:${PORT}`);
  console.log('\n📚 Endpoints disponibles:');
  console.log('\n   Autenticación:');
  console.log('   POST   /api/auth/login');
  console.log('   POST   /api/auth/logout');
  console.log('   GET    /api/auth/me');
  console.log('   POST   /api/auth/refresh');
  console.log('\n   Usuarios:');
  console.log('   GET    /api/users (con paginación)');
  console.log('   GET    /api/users/:id');
  console.log('   POST   /api/users');
  console.log('   PUT    /api/users/:id');
  console.log('   PATCH  /api/users/:id');
  console.log('   PATCH  /api/users/me');
  console.log('   GET    /api/users/me/activity');
  console.log('   POST   /api/users/:id/activate');
  console.log('   POST   /api/users/:id/deactivate');
  console.log('   POST   /api/users/:id/change-password');
  console.log('   DELETE /api/users/:id');
  console.log('\n   Colaboradores:');
  console.log('   GET    /api/collaborators (con filtros: search, areaId, adscripcionId, puestoId, tipoContrato, isActive, estadoExpediente, limit, offset, sortBy, sortOrder)');
  console.log('   GET    /api/collaborators/:id');
  console.log('   POST   /api/collaborators');
  console.log('   PUT    /api/collaborators/:id');
  console.log('   DELETE /api/collaborators/:id');
  console.log('   POST   /api/collaborators/:id/activate');
  console.log('   POST   /api/collaborators/:id/deactivate');
  console.log('   GET    /api/collaborators/:id/documents');
  console.log('\n   Documentos:');
  console.log('   GET    /api/documents (con paginación)');
  console.log('   GET    /api/documents/:id');
  console.log('   POST   /api/documents (multipart/form-data)');
  console.log('   PUT    /api/documents/:id');
  console.log('   DELETE /api/documents/:id');
  console.log('   GET    /api/documents/:id/download');
  console.log('\n   Minutas:');
  console.log('   GET    /api/minutes (con filtros: search, tipo, fechaDesde, fechaHasta, isActive, limit, offset, sortBy, sortOrder)');
  console.log('   GET    /api/minutes/:id');
  console.log('   POST   /api/minutes (multipart/form-data)');
  console.log('   PUT    /api/minutes/:id');
  console.log('   DELETE /api/minutes/:id');
  console.log('   GET    /api/minutes/:id/download');
  console.log('\n   Catálogos:');
  console.log('   GET    /api/catalogs/areas (con paginación)');
  console.log('   POST   /api/catalogs/areas/:id/activate');
  console.log('   POST   /api/catalogs/areas/:id/deactivate');
  console.log('   GET    /api/catalogs/adscripciones (con paginación)');
  console.log('   POST   /api/catalogs/adscripciones/:id/activate');
  console.log('   POST   /api/catalogs/adscripciones/:id/deactivate');
  console.log('   GET    /api/catalogs/puestos (con paginación)');
  console.log('   POST   /api/catalogs/puestos/:id/activate');
  console.log('   POST   /api/catalogs/puestos/:id/deactivate');
  console.log('   GET    /api/catalogs/document-types (con paginación)');
  console.log('   POST   /api/catalogs/document-types/:id/activate');
  console.log('   POST   /api/catalogs/document-types/:id/deactivate');
  console.log('\n   Auditoría:');
  console.log('   GET    /api/audit (con filtros y paginación)');
  console.log('   GET    /api/audit/:id');
  console.log('   GET    /api/audit/user/:userId');
  console.log('   GET    /api/audit/entity/:entity/:entityId');
  console.log('\n   Reportes:');
  console.log('   GET    /api/reports/summary (con filtro opcional: ?areaId=1)');
  console.log('\n✨ Listo para recibir peticiones!\n');
});
