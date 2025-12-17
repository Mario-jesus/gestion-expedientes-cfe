# Contexto del Proyecto

## Resumen Ejecutivo
- Desarrollo de un sistema web para gestionar expedientes de colaboradores ocupacionalmente expuestos en la Comisión Federal de Electricidad (zona Ríos, Palenque, Chiapas).
- Duración estimada del proyecto: 4 a 6 meses, cubriendo desde el análisis inicial hasta la capacitación del personal.
- Objetivo principal: optimizar el acceso y la administración de la información de los colaboradores, reduciendo tiempos de búsqueda y mejorando el control de datos sensibles.

## Situación Actual y Problemas
- Gestión manual mediante carpetas físicas que retrasa la localización de información y expone la confidencialidad de los datos.
- Riesgos principales:
  - Extravío o pérdida de documentos relevantes.
  - Acceso no autorizado a expedientes físicos.
  - Elevados tiempos en búsquedas y consultas administrativas.

## Objetivos del Proyecto
- **General:** Implementar un sistema web que aumente la eficiencia en la gestión de expedientes de colaboradores de alto riesgo.
- **Específicos:**
  - Analizar los procesos actuales para definir requerimientos y oportunidades de mejora.
  - Diseñar la arquitectura del sistema y los módulos de registro, consulta, actualización y seguimiento de expedientes.
  - Construir funciones clave: gestión de usuarios, control de acceso, carga de documentos y generación de reportes.
  - Elaborar el modelo entidad-relación y desarrollar una base de datos estructurada.
  - Incorporar controles de seguridad que protejan la confidencialidad, integridad y disponibilidad de los datos.
  - Ejecutar pruebas funcionales y de usabilidad con el personal encargado de expedientes.
  - Documentar el sistema (manuales de usuario y administrador).
  - Planificar y ejecutar la capacitación operativa para el personal de la CFE.

## Justificación
- La digitalización mitigará la dependencia de expedientes físicos, reducirá pérdidas de información y fortalecerá la seguridad mediante roles y accesos controlados.
- El sistema permitirá que únicamente personal autorizado, especialmente administradores, gestione los expedientes sensibles.

## Alcance Funcional y Limitaciones
- **Funciones previstas:**
  - Creación, consulta, edición y eliminación/desactivación de expedientes.
  - Gestión de usuarios con roles diferenciados (Administrador y Usuario Regular).
  - Carga y administración de documentos asociados a cada expediente.
- **Limitaciones:**
  - Implementación en un entorno local por falta de presupuesto para infraestructura de servidores.
  - Uso exclusivo de tecnologías libres y de código abierto; sin licencias de software de paga.
  - Selección pendiente de la base de datos (evaluación entre crear una nueva o aprovechar una existente).

## Metodología Adaptada
1. **Familiarización:** Levantamiento de información del proceso actual y categorización de tipos de colaboradores.
2. **Investigación:** Definición de perfiles de usuario, herramientas tecnológicas, recursos y requerimientos funcionales/no funcionales.
3. **Diseño:** Elaboración de arquitectura técnica, base de datos, interfaz de usuario y definición de módulos.
4. **Desarrollo:** Codificación iterativa con validaciones continuas junto al personal involucrado.
5. **Documentación:** Creación de manuales de usuario y administrador para operación y soporte.
6. **Lanzamiento y Soporte:** Pruebas integrales, liberación del sistema y establecimiento de un plan de soporte post-implementación.

## Herramientas y Tecnologías
- **Diseño:** Bocetos iniciales y prototipos en Figma u otras herramientas de prototipado.
- **Frontend:** HTML, CSS y JavaScript.
- **Backend:** JavaScript.
- **Base de datos:** Alternativas abiertas; decisión final sujeta a viabilidad (posibilidad de crear una nueva o reutilizar una existente).

## Requerimientos
- **Funcionales:**
  - Módulo de colaboradores con CRUD completo y buscador (por nombre, número de empleado, etc.).
  - Módulo de archivos con carga de documentos en formatos como PDF y JPG.
  - Módulo de usuarios con autenticación (usuario/contraseña) y roles diferenciados.
- **No funcionales:**
  - Cifrado de contraseñas en la base de datos.
  - Compatibilidad con navegadores actuales (Chrome, Firefox, Edge).
  - Interfaz optimizada para uso en computadoras de escritorio.


