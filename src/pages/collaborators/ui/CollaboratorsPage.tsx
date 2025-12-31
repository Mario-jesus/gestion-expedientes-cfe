import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { useCollaboratorsList, CollaboratorCard } from '@features/collaborators/list-collaborators';
import {
  setSearchFilter,
  setAreaFilter,
  setAdscripcionFilter,
  setPuestoFilter,
  setTipoContratoFilter,
  setEstadoExpedienteFilter,
  setActiveFilter,
  clearFilters,
} from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import type { Area, Adscripcion, Puesto } from '@entities/collaborator';
import { ROUTES } from '@shared/lib/routes';
import { Link } from 'react-router-dom';
import styles from './CollaboratorsPage.module.scss';

/**
 * Página principal de gestión de colaboradores
 */
export function CollaboratorsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { collaborators, isLoading, error, filters, stats, refetch } =
    useCollaboratorsList();

  const [areas, setAreas] = useState<Area[]>([]);
  const [adscripciones, setAdscripciones] = useState<Adscripcion[]>([]);
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  // Cargar catálogos
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [areasResponse, puestosResponse] = await Promise.all([
          catalogsApi.areas.getAll(),
          catalogsApi.puestos.getAll(),
        ]);
        setAreas(areasResponse.data);
        setPuestos(puestosResponse.data);

        // Si hay un área seleccionada, cargar sus adscripciones
        if (filters.areaId) {
          const adscripcionesResponse = await catalogsApi.adscripciones.getByArea(
            filters.areaId
          );
          setAdscripciones(adscripcionesResponse.data);
        }
      } catch (err) {
        console.error('Error cargando catálogos:', err);
      } finally {
        setLoadingCatalogs(false);
      }
    };

    loadCatalogs();
  }, [filters.areaId]);

  // Cargar adscripciones cuando cambie el área
  useEffect(() => {
    const loadAdscripciones = async () => {
      if (filters.areaId) {
        try {
          const response = await catalogsApi.adscripciones.getByArea(
            filters.areaId
          );
          setAdscripciones(response.data);
        } catch (err) {
          console.error('Error cargando adscripciones:', err);
        }
      } else {
        setAdscripciones([]);
      }
    };

    loadAdscripciones();
  }, [filters.areaId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value || undefined;
    dispatch(setAreaFilter(areaId));
    // Limpiar adscripción cuando cambia el área
    if (!areaId) {
      dispatch(setAdscripcionFilter(undefined));
    }
  };

  const handleAdscripcionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const adscripcionId = e.target.value || undefined;
    dispatch(setAdscripcionFilter(adscripcionId));
  };

  const handlePuestoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const puestoId = e.target.value || undefined;
    dispatch(setPuestoFilter(puestoId));
  };

  const handleTipoContratoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipoContrato = e.target.value || undefined;
    dispatch(setTipoContratoFilter(tipoContrato as any));
  };

  const handleEstadoExpedienteChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const estadoExpediente = e.target.value || undefined;
    dispatch(setEstadoExpedienteFilter(estadoExpediente as any));
  };

  const handleActiveFilter = (isActive: boolean | undefined) => {
    dispatch(setActiveFilter(isActive));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters =
    filters.search ||
    filters.areaId ||
    filters.adscripcionId ||
    filters.puestoId ||
    filters.tipoContrato ||
    filters.estadoExpediente ||
    filters.isActive !== undefined;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Gestión de Colaboradores</h1>
          <p className={styles.subtitle}>
            Administra los expedientes digitales de los colaboradores de CFE
          </p>
        </div>

        <Link to={ROUTES.COLLABORATOR_NEW} className={styles.addButton}>
          <span className={styles.addIcon}>➕</span>
          Nuevo Colaborador
        </Link>
      </header>

      {/* Estadísticas */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.activos}</span>
          <span className={styles.statLabel}>Activos</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.inactivos}</span>
          <span className={styles.statLabel}>Inactivos</span>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos o RPE..."
            value={filters.search || ''}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.filters}>
          <select
            className={styles.filterSelect}
            value={filters.areaId || ''}
            onChange={handleAreaChange}
            disabled={loadingCatalogs}
          >
            <option value="">Todas las áreas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nombre}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={filters.adscripcionId || ''}
            onChange={handleAdscripcionChange}
            disabled={!filters.areaId || loadingCatalogs}
          >
            <option value="">Todas las adscripciones</option>
            {adscripciones.map((adscripcion) => (
              <option key={adscripcion.id} value={adscripcion.id}>
                {adscripcion.nombre}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={filters.puestoId || ''}
            onChange={handlePuestoChange}
            disabled={loadingCatalogs}
          >
            <option value="">Todos los puestos</option>
            {puestos.map((puesto) => (
              <option key={puesto.id} value={puesto.id}>
                {puesto.nombre}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={filters.tipoContrato || ''}
            onChange={handleTipoContratoChange}
          >
            <option value="">Todos los tipos</option>
            <option value="base">Base</option>
            <option value="confianza">Confianza</option>
            <option value="eventual">Eventual</option>
            <option value="honorarios">Honorarios</option>
            <option value="otro">Otro</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filters.estadoExpediente || ''}
            onChange={handleEstadoExpedienteChange}
          >
            <option value="">Todos los estados</option>
            <option value="completo">Completo</option>
            <option value="incompleto">Incompleto</option>
            <option value="sin_documentos">Sin documentos</option>
          </select>

          <div className={styles.statusFilters}>
            <button
              className={`${styles.filterButton} ${
                filters.isActive === undefined ? styles.active : ''
              }`}
              onClick={() => handleActiveFilter(undefined)}
            >
              Todos
            </button>
            <button
              className={`${styles.filterButton} ${
                filters.isActive === true ? styles.active : ''
              }`}
              onClick={() => handleActiveFilter(true)}
            >
              Activos
            </button>
            <button
              className={`${styles.filterButton} ${
                filters.isActive === false ? styles.active : ''
              }`}
              onClick={() => handleActiveFilter(false)}
            >
              Inactivos
            </button>
          </div>

          {hasActiveFilters && (
            <button
              className={styles.clearButton}
              onClick={handleClearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de colaboradores */}
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingState}>Cargando colaboradores...</div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={() => refetch()}>Reintentar</button>
          </div>
        ) : collaborators.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No se encontraron colaboradores.</p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters}>Limpiar filtros</button>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {collaborators.map((collaborator) => (
              <CollaboratorCard
                key={collaborator.id}
                collaborator={collaborator}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
