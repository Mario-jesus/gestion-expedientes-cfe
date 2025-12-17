import { useEffect, useState } from 'react';
import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type { LogEntry } from '@entities/collaborator';
import styles from './UserActivityLog.module.scss';

interface UserActivityLogProps {
  userId: string;
}

/**
 * Componente para mostrar el historial de actividad del usuario
 */
export function UserActivityLog({ userId }: UserActivityLogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [userId]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener todos los logs y filtrar por userId
      const allLogs = await apiClient.get<LogEntry[]>(API_ENDPOINTS.LOGS.LIST);
      const userLogs = allLogs.filter((log) => log.userId === userId);

      // Ordenar por fecha más reciente primero
      const sortedLogs = userLogs.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setLogs(sortedLogs);
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
    };
    return labels[action] || action;
  };

  const getEntityLabel = (entity: string) => {
    const labels: Record<string, string> = {
      collaborator: 'Colaborador',
      document: 'Documento',
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
          const fileName =
            log.metadata?.fileName && typeof log.metadata.fileName === 'string'
              ? log.metadata.fileName
              : null;

          return (
            <div key={log.id} className={styles.logItem}>
              <div className={styles.logIcon}>
                {log.action === 'create' && '➕'}
                {log.action === 'update' && '✏️'}
                {log.action === 'delete' && '🗑️'}
                {log.action === 'download' && '⬇️'}
                {log.action === 'upload' && '📤'}
                {log.action === 'view' && '👁️'}
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
