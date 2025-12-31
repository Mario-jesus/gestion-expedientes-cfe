import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@app/providers/store';
import {
  fetchMinutes,
  selectMinutesLoading,
  selectMinutesError,
  selectMinuteById,
} from '@entities/minute';
import { usersApi } from '@entities/user';
import { Modal } from '@shared/ui';
import { EditMinuteForm } from '@features/minutes/edit-minute';
import { DeleteMinuteDialog } from '@features/minutes/delete-minute';
import { ROUTES } from '@shared/lib/routes';
import { getMinuteTypeLabel } from '@entities/minute';
import { useDownloadMinute } from '@shared/hooks/useDownloadMinute';
import type { Minute } from '@entities/minute';
import type { User } from '@entities/user';
import styles from './MinuteDetailPage.module.scss';

/**
 * Página de detalle de minuta
 */
export function MinuteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [minute, setMinute] = useState<Minute | null>(null);
  const [uploadedByUser, setUploadedByUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const { viewMinute, isLoading: isDownloading } = useDownloadMinute();

  const minuteFromStore = useSelector((state: RootState) =>
    id ? selectMinuteById(id)(state) : null
  );
  const isLoading = useSelector(selectMinutesLoading);
  const error = useSelector(selectMinutesError);

  // Cargar minutas y encontrar la minuta actual
  useEffect(() => {
    if (!minuteFromStore && id) {
      dispatch(fetchMinutes(undefined));
    } else {
      setMinute(minuteFromStore || null);
    }
  }, [dispatch, id, minuteFromStore]);

  // Cargar información del usuario que subió la minuta
  useEffect(() => {
    if (minute?.uploadedBy) {
      setIsLoadingUser(true);
      usersApi
        .getById(minute.uploadedBy)
        .then((user) => {
          setUploadedByUser(user);
        })
        .catch((err) => {
          console.error('Error cargando usuario:', err);
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    }
  }, [minute?.uploadedBy]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    dispatch(fetchMinutes(undefined));
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    navigate(ROUTES.MINUTES);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Cargando minuta...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>Error: {error}</p>
          <Link to={ROUTES.MINUTES} className={styles.backButton}>
            Volver a Minutas
          </Link>
        </div>
      </div>
    );
  }

  if (!minute) {
    return (
      <div className={styles.container}>
        <div className={styles.notFoundState}>
          <h2>Minuta no encontrada</h2>
          <p>La minuta que buscas no existe o ha sido eliminada.</p>
          <Link to={ROUTES.MINUTES} className={styles.backButton}>
            Volver a Minutas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to={ROUTES.MINUTES} className={styles.backLink}>
            ← Volver a Minutas
          </Link>
          <h1 className={styles.title}>{minute.titulo}</h1>
          <div className={styles.badges}>
            <span className={styles.typeBadge}>
              {getMinuteTypeLabel(minute.tipo)}
            </span>
            {minute.isActive ? (
              <span className={styles.activeBadge}>Activa</span>
            ) : (
              <span className={styles.inactiveBadge}>Inactiva</span>
            )}
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.editButton}
            onClick={() => setIsEditModalOpen(true)}
          >
            ✏️ Editar
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        {/* Información Principal */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información General</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Título:</span>
              <span className={styles.infoValue}>{minute.titulo}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tipo:</span>
              <span className={styles.infoValue}>
                {getMinuteTypeLabel(minute.tipo)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fecha de la Minuta:</span>
              <span className={styles.infoValue}>{formatDate(minute.fecha)}</span>
            </div>
            {minute.descripcion && (
              <div className={styles.infoItemFull}>
                <span className={styles.infoLabel}>Descripción:</span>
                <p className={styles.infoValue}>{minute.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Información del Archivo */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Archivo</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItemFull}>
              <span className={styles.infoLabel}>Nombre del Archivo:</span>
              <span className={styles.infoValue}>{minute.fileName}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tamaño:</span>
              <span className={styles.infoValue}>
                {formatFileSize(minute.fileSize)}
              </span>
            </div>
            {minute.fileType && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tipo:</span>
                <span className={styles.infoValue}>{minute.fileType}</span>
              </div>
            )}
            <div className={styles.infoItemFull}>
              <button
                onClick={() => viewMinute(minute.id)}
                disabled={isDownloading}
                className={styles.viewFileButton}
              >
                {isDownloading ? 'Cargando...' : '📄 Ver Documento'}
              </button>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información de Carga</h2>
          <div className={styles.infoGrid}>
            {isLoadingUser ? (
              <div className={styles.infoItemFull}>
                <span className={styles.infoLabel}>Cargando información del usuario...</span>
              </div>
            ) : uploadedByUser ? (
              <>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Subido por:</span>
                  <span className={styles.infoValue}>{uploadedByUser.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Usuario:</span>
                  <span className={styles.infoValue}>{uploadedByUser.username}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Rol:</span>
                  <span className={styles.infoValue}>
                    {uploadedByUser.role === 'admin' ? 'Administrador' : 'Operador'}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.infoItemFull}>
                <span className={styles.infoLabel}>Usuario no encontrado</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fecha de Carga:</span>
              <span className={styles.infoValue}>
                {formatDateTime(minute.uploadedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Información del Sistema */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información del Sistema</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Creado:</span>
              <span className={styles.infoValue}>
                {formatDateTime(minute.createdAt)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Última Actualización:</span>
              <span className={styles.infoValue}>
                {formatDateTime(minute.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {minute && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Minuta"
          size="large"
        >
          <EditMinuteForm
            minute={minute}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}

      {/* Diálogo de eliminación */}
      <DeleteMinuteDialog
        minute={minute}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
