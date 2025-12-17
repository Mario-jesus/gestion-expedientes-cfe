# 📁 Sistema de Gestión de Expedientes CFE

Sistema web para la gestión de expedientes y documentos de empleados, desarrollado con React, TypeScript y Vite.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Credenciales de Prueba](#credenciales-de-prueba)
- [Scripts Disponibles](#scripts-disponibles)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## ✨ Características

### Autenticación y Usuarios
- 🔐 **Autenticación** con persistencia de sesión
- 👥 **Gestión de usuarios** (CRUD completo)
- 👤 **Mi Perfil** - Ver y actualizar información personal, cambiar contraseña, ver historial de actividad
- 🔒 **Control de acceso basado en roles** (Admin/Operador)
- ✅ **Validación de usuarios activos** - Solo usuarios activos pueden acceder

### Gestión de Colaboradores
- 📄 **Gestión de colaboradores** (CRUD completo)
- 📁 **Gestión de expedientes** - Documentos de colaboradores con categorización
- 📝 **Carga de documentos** - Subir documentos por tipo (batería, historial, perfil, constancia, otro)
- ✏️ **Edición y eliminación** de documentos
- 📊 **Estado de expediente** - Visualización de expedientes completos, incompletos o sin documentos
- 🔍 **Búsqueda y filtros avanzados** - Por nombre, RPE, área, adscripción, puesto, tipo de contrato

### Gestión de Minutas
- 📝 **Gestión de minutas** (CRUD completo) - Documentos independientes de colaboradores
- 🏷️ **Tipos de minutas** - Reunión, Junta, Acuerdo, Memorándum, Otro
- 🔍 **Filtros y búsqueda** - Por título, descripción, tipo y fecha
- 📄 **Vista de detalle** - Información completa de cada minuta con metadatos

### Configuración
- ⚙️ **Gestión de catálogos** - Áreas, Adscripciones, Puestos, Tipos de Documento
- 🔄 **CRUD completo** para todos los catálogos
- 🎯 **Solo administradores** - Acceso restringido a configuración

### Interfaz y UX
- 🎨 **Interfaz moderna y responsiva** - Diseño adaptativo para móviles, tablets y desktop
- 📱 **Menú móvil** - Hamburger menu con sidebar colapsable
- 🔔 **Sistema de notificaciones** - Toasts para éxito, error, advertencia e información
- 🎯 **Dashboard** - Panel de control con estadísticas y accesos rápidos
- 🌓 **Tema consistente** - Diseño con colores corporativos (verde CFE)

### Desarrollo
- 🚀 **API Mock** - JSON Server con endpoints personalizados para desarrollo sin backend
- 📊 **Logs de auditoría** - Registro automático de acciones del sistema

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **Git**

Verifica las versiones instaladas:

```bash
node --version
npm --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd gestion-expedientes-cfe
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias, incluyendo:
- React 19
- TypeScript
- Redux Toolkit
- React Router
- JSON Server (para API mock)
- Vite (build tool)

---

## ⚙️ Configuración

### 1. Crear archivo de variables de entorno

Crea el archivo `.env.development` en la raíz del proyecto:

```bash
touch .env.development
```

### 2. Configurar variables de entorno

Agrega el siguiente contenido al archivo `.env.development`:

```env
# Ambiente
VITE_APP_ENV=development

# API - JSON Server (mock)
VITE_API_BASE_URL=http://localhost:3001

# Información de la aplicación
VITE_APP_NAME=Gestión de Expedientes CFE
VITE_APP_VERSION=0.0.0

# Logger (para debugging)
VITE_ENABLE_LOGGER=true
VITE_MIN_LOG_LEVEL=debug

# Mock API
VITE_ENABLE_MOCK_API=false
```

### 3. Verificar base de datos mock

El archivo `db.json` ya incluye datos de prueba. No necesitas modificarlo.

---

## 🏃 Ejecución

### Modo Desarrollo (Recomendado)

Necesitas **dos terminales** abiertas:

#### Terminal 1: Iniciar servidor API Mock

```bash
npm run api
```

Verás el mensaje:
```
🚀 JSON Server está corriendo en:
   http://localhost:3001
```

#### Terminal 2: Iniciar aplicación React

```bash
npm run dev
```

La aplicación estará disponible en:
```
http://localhost:5173
```

### Otros Comandos

```bash
# Ejecutar linter
npm run lint

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## 🔑 Credenciales de Prueba

Puedes usar cualquiera de estos usuarios para iniciar sesión:

### Usuarios Activos

| Username | Nombre | Role | Password |
|----------|--------|------|----------|
| `admin` | Administrador Principal | Admin | cualquiera |
| `operador1` | José García Martínez | Operator | cualquiera |
| `operador3` | Carmen Díaz Torres | Operator | cualquiera |

### Usuarios Inactivos (Login fallará)

| Username | Nombre | Role |
|----------|--------|------|
| `operador2` | Patricia López Ruiz | Operator |
| `supervisor` | Roberto Hernández Silva | Admin |

> **Nota:** El servidor mock no valida contraseñas. Puedes usar cualquier texto como password.

### Ejemplo de Login

```
Username: admin
Password: test
```

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `npm run dev` | Inicia el servidor de desarrollo |
| API Mock | `npm run api` | Inicia el servidor JSON Server |
| API Simple | `npm run api:simple` | JSON Server sin endpoints personalizados |
| Build | `npm run build` | Compila para producción |
| Build Dev | `npm run build:dev` | Compila para desarrollo |
| Preview | `npm run preview` | Vista previa de producción |
| Lint | `npm run lint` | Ejecuta ESLint |

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Redux Toolkit** - Gestión de estado
- **React Router DOM** - Enrutamiento
- **SASS** - Preprocesador CSS

### Backend Mock

- **JSON Server 0.17.4** - API REST mock
- **Custom Express Middleware** - Endpoints personalizados

### Desarrollo

- **ESLint** - Linter
- **TypeScript ESLint** - Reglas de TypeScript

---

## 📁 Estructura del Proyecto

```
gestion-expedientes-cfe/
├── public/              # Archivos estáticos
├── src/
│   ├── app/            # Configuración de la aplicación
│   │   ├── providers/  # Providers (Redux, Router, Toast)
│   │   └── styles/     # Estilos globales
│   ├── entities/       # Entidades del dominio
│   │   ├── user/       # Usuario (tipos, API, slice, thunks)
│   │   ├── collaborator/ # Colaborador (tipos, API, slice, thunks)
│   │   └── minute/     # Minuta (tipos, API, slice, thunks)
│   ├── features/       # Características/módulos
│   │   ├── auth/       # Autenticación
│   │   ├── users/      # Gestión de usuarios
│   │   ├── collaborators/ # Gestión de colaboradores
│   │   │   ├── create-collaborator/
│   │   │   ├── edit-collaborator/
│   │   │   ├── delete-collaborator/
│   │   │   ├── upload-document/
│   │   │   ├── edit-document/
│   │   │   └── delete-document/
│   │   ├── minutes/    # Gestión de minutas
│   │   │   ├── create-minute/
│   │   │   ├── edit-minute/
│   │   │   └── delete-minute/
│   │   ├── profile/    # Perfil de usuario
│   │   │   ├── update-profile/
│   │   │   ├── change-password/
│   │   │   └── user-activity-log/
│   │   └── settings/   # Configuración
│   │       ├── areas-management/
│   │       ├── adscripciones-management/
│   │       ├── puestos-management/
│   │       └── document-types-management/
│   ├── pages/          # Páginas de la aplicación
│   │   ├── login/      # Página de login
│   │   ├── dashboard/  # Panel de control
│   │   ├── users/      # Gestión de usuarios
│   │   ├── collaborators/ # Lista de colaboradores
│   │   ├── collaborator-detail/ # Detalle de colaborador
│   │   ├── collaborator-new/ # Nuevo colaborador
│   │   ├── minutes/    # Lista de minutas
│   │   ├── minute-detail/ # Detalle de minuta
│   │   ├── profile/    # Mi perfil
│   │   ├── settings/   # Configuración
│   │   └── not-found/  # Página 404
│   ├── shared/         # Código compartido
│   │   ├── api/        # Cliente API y endpoints
│   │   ├── config/     # Configuración (logger, etc.)
│   │   ├── lib/        # Utilidades (rutas, helpers)
│   │   ├── providers/  # Providers (Toast)
│   │   └── ui/         # Componentes UI compartidos
│   │       ├── Button/
│   │       ├── Input/
│   │       ├── Modal/
│   │       ├── Toast/
│   │       ├── Tabs/
│   │       └── ConfirmDialog/
│   └── widgets/        # Widgets complejos
│       ├── header/     # Header de la aplicación
│       └── sidebar/    # Sidebar de navegación
├── docs/               # Documentación
│   ├── ENDPOINTS_API.md
│   ├── PENDIENTES_DESARROLLO.md
│   └── ANALISIS_PENDIENTES_ACTUALIZADO.md
├── db.json            # Base de datos mock
├── server.cjs         # Servidor JSON Server personalizado
├── .env.development   # Variables de entorno (crear)
└── package.json       # Dependencias y scripts
```

### Arquitectura: Feature-Sliced Design

El proyecto sigue los principios de **Feature-Sliced Design (FSD)**, una arquitectura moderna que organiza el código por:

- **app** - Configuración de la aplicación (providers, router)
- **pages** - Páginas/rutas de la aplicación
- **widgets** - Componentes grandes y complejos (Header, Sidebar)
- **features** - Funcionalidades/características específicas (CRUD, formularios)
- **entities** - Entidades del dominio (User, Collaborator, Minute)
- **shared** - Código compartido (UI components, utilities, API client)

### Páginas Disponibles

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/login` | Inicio de sesión | Público |
| `/dashboard` | Panel de control con estadísticas | Autenticado |
| `/colaboradores` | Lista de colaboradores | Autenticado |
| `/colaboradores/nuevo` | Crear nuevo colaborador | Autenticado |
| `/colaboradores/:id` | Detalle de colaborador | Autenticado |
| `/minutas` | Lista de minutas | Autenticado |
| `/minutas/:id` | Detalle de minuta | Autenticado |
| `/perfil` | Mi perfil de usuario | Autenticado |
| `/usuarios` | Gestión de usuarios | Solo Admin |
| `/configuracion` | Configuración del sistema | Solo Admin |

---

## 🔧 Configuración Adicional

### Para Producción

1. Crea el archivo `.env.production`
2. Configura `VITE_API_BASE_URL` con la URL de tu API real
3. Ejecuta `npm run build`
4. Los archivos compilados estarán en `dist/`

### Variables de Entorno Disponibles

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_APP_ENV` | Ambiente (development/production) | ✅ |
| `VITE_API_BASE_URL` | URL base de la API | ✅ |
| `VITE_APP_NAME` | Nombre de la aplicación | ✅ |
| `VITE_APP_VERSION` | Versión de la aplicación | ✅ |
| `VITE_ENABLE_LOGGER` | Activar logs (true/false) | ❌ |
| `VITE_MIN_LOG_LEVEL` | Nivel de logs (debug/info/warn/error) | ❌ |

---

## 🐛 Solución de Problemas

### El servidor API no inicia

```bash
# Verifica que el puerto 3001 esté libre
lsof -i :3001

# O mata el proceso que lo usa
fuser -k 3001/tcp
```

### La sesión no persiste al recargar

1. Verifica que `localStorage` esté habilitado en tu navegador
2. Revisa las variables de entorno en `.env.development`
3. Asegúrate de que el servidor API esté corriendo

### Error de CORS

El servidor mock ya tiene CORS configurado. Si usas un backend real, asegúrate de que tenga CORS habilitado.

---

## 📝 Notas

- El servidor mock **no valida contraseñas** - cualquier texto funciona
- Los tokens son simulados con formato: `mock-jwt-token-{userId}-{timestamp}`
- Los cambios en usuarios/datos se guardan en `db.json` automáticamente
- La autenticación persiste usando `localStorage`
- El sistema usa **baja lógica** - Los elementos eliminados se marcan como `isActive: false`
- Los **logs de auditoría** se crean automáticamente para acciones importantes
- El sistema de **notificaciones** muestra toasts para feedback inmediato al usuario
- El **menú móvil** se activa automáticamente en pantallas menores a 768px

---

## 🤝 Contribuir

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 👨‍💻 Autor

Desarrollado para CFE

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.
