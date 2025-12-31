import { useEffect, useState } from 'react';
import { auditApi, type AuditLog } from '@shared/api/auditApi';
import styles from './UserActivityLog.module.scss';

interface UserActivityLogProps {
  userId: string;
}

/**
 * Componente para mostrar el historial de actividad del usuario
 */
export function UserActivityLog({ userId }: UserActivityLogProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Usar el endpoint específico para obtener logs del usuario
      const response = await auditApi.getByUser(userId, {
        limit: 100, // Obtener más logs para el historial del usuario
        offset: 0,
      });

      // Los logs ya vienen ordenados por fecha más reciente primero (default de la API)
      setLogs(response.data);
    } catch (err) {
      console.error('Error cargando logs:', err);
      setError('Error al cargar el historial de actividad');
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create: 'Crear',
      update: 'Actualizar',
      delete: 'Eliminar',
      download: 'Descargar',
      upload: 'Subir',
      view: 'Ver',
      activate: 'Activar',
      deactivate: 'Desactivar',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      refresh_token: 'Renovar token',
      change_password: 'Cambiar contraseña',
    };
    return labels[action] || action;
  };

  const getEntityLabel = (entity: string) => {
    const labels: Record<string, string> = {
      User: 'Usuario',
      Collaborator: 'Colaborador',
      Document: 'Documento',
      Minute: 'Minuta',
      Area: 'Área',
      Adscripcion: 'Adscripción',
      Puesto: 'Puesto',
      DocumentType: 'Tipo de Documento',
      // Mantener compatibilidad con nombres en minúsculas
      collaborator: 'Colaborador',
      document: 'Documento',
      minute: 'Minuta',
      area: 'Área',
      adscripcion: 'Adscripción',
      puesto: 'Puesto',
      documentType: 'Tipo de Documento',
    };
    return labels[entity] || entity;
  };

  if (isLoading) {
    return <div className={styles.loading}>Cargando historial de actividad...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (logs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No hay registros de actividad.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Historial de Actividad</h3>
        <p className={styles.subtitle}>
          Registro de todas tus acciones en el sistema
        </p>
      </div>

      <div className={styles.logsList}>
        {logs.map((log) => {
          // Buscar fileName en details (nuevo formato) o metadata (formato antiguo)
          let fileName: string | null = null;

          if (log.details) {
            // Intentar obtener fileName directamente de details
            if (typeof log.details.fileName === 'string') {
              fileName = log.details.fileName;
            }
            // Si no está en details, buscar en metadata
            else if (log.details.metadata && typeof log.details.metadata === 'object') {
              const metadata = log.details.metadata as Record<string, unknown>;
              if (typeof metadata.fileName === 'string') {
                fileName = metadata.fileName;
              }
            }
          }

          return (
            <div key={log.id} className={styles.logItem}>
              <div className={styles.logIcon}>
                {log.action === 'create' && '➕'}
                {log.action === 'update' && '✏️'}
                {log.action === 'delete' && '🗑️'}
                {log.action === 'download' && '⬇️'}
                {log.action === 'upload' && '📤'}
                {log.action === 'view' && '👁️'}
                {log.action === 'activate' && '✅'}
                {log.action === 'deactivate' && '❌'}
                {log.action === 'login' && '🔐'}
                {log.action === 'logout' && '🚪'}
                {log.action === 'refresh_token' && '🔄'}
                {log.action === 'change_password' && '🔑'}
              </div>
              <div className={styles.logContent}>
                <div className={styles.logAction}>
                  <strong>{getActionLabel(log.action)}</strong>{' '}
                  {getEntityLabel(log.entity)}
                  {fileName && (
                    <span className={styles.logMetadata}> - {fileName}</span>
                  )}
                </div>
                <div className={styles.logDate}>
                  {new Date(log.createdAt).toLocaleString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
