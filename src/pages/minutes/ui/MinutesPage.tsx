import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import {
  fetchMinutes,
  selectMinutesLoading,
  selectMinutesError,
  selectFilteredMinutes,
  setSearchFilter,
  setTipoFilter,
  clearFilters,
  getMinuteTypeLabel,
} from '@entities/minute';
import { Modal } from '@shared/ui';
import { CreateMinuteForm } from '@features/minutes/create-minute';
import type { MinuteType } from '@entities/minute';
import styles from './MinutesPage.module.scss';

/**
 * Página principal de gestión de minutas
 */
export function MinutesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const minutes = useSelector(selectFilteredMinutes);
  const isLoading = useSelector(selectMinutesLoading);
  const error = useSelector(selectMinutesError);

  // Cargar minutas al montar
  useEffect(() => {
    dispatch(fetchMinutes(undefined));
  }, [dispatch]);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    dispatch(fetchMinutes(undefined));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setTipoFilter(value === '' ? undefined : (value as MinuteType)));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Minutas</h1>
          <p className={styles.subtitle}>
            Gestión de documentos y minutas del sistema
          </p>
        </div>
        <button
          className={styles.createButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          ➕ Nueva Minuta
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Buscar por título o descripción..."
          className={styles.searchInput}
          onChange={handleSearchChange}
        />
        <select
          className={styles.filterSelect}
          onChange={handleTipoChange}
        >
          <option value="">Todos los tipos</option>
          <option value="reunion">Reunión</option>
          <option value="junta">Junta</option>
          <option value="acuerdo">Acuerdo</option>
          <option value="memorandum">Memorándum</option>
          <option value="otro">Otro</option>
        </select>
        <button
          className={styles.clearFiltersButton}
          onClick={handleClearFilters}
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Contenido */}
      {error && (
        <div className={styles.errorMessage}>
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingState}>Cargando minutas...</div>
      ) : minutes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay minutas registradas.</p>
          <button
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Primera Minuta
          </button>
        </div>
      ) : (
        <div className={styles.minutesGrid}>
          {minutes.map((minute) => (
            <div key={minute.id} className={styles.minuteCard}>
              <div className={styles.minuteHeader}>
                <h3 className={styles.minuteTitle}>{minute.titulo}</h3>
                <span className={styles.minuteType}>
                  {getMinuteTypeLabel(minute.tipo)}
                </span>
              </div>
              {minute.descripcion && (
                <p className={styles.minuteDescription}>{minute.descripcion}</p>
              )}
              <div className={styles.minuteMeta}>
                <span className={styles.minuteDate}>
                  📅 {new Date(minute.fecha).toLocaleDateString('es-MX')}
                </span>
                <span className={styles.minuteFile} title={minute.fileName}>
                  📄 {minute.fileName}
                </span>
              </div>
              <div className={styles.minuteActions}>
                <a
                  href={minute.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewButton}
                >
                  Ver Documento
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva Minuta"
        size="large"
      >
        <CreateMinuteForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
