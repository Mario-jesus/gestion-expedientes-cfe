import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch } from '@app/providers/store';
import {
  selectDocuments,
  selectCollaborators,
  fetchDocuments,
  fetchCollaborators,
  getDocumentKindLabel,
} from '@entities/collaborator';
import { buildRoute } from '@shared/lib/routes';
import type { DocumentKind } from '@entities/collaborator';
import styles from './FilesPage.module.scss';

/**
 * Página de gestión de archivos/documentos
 */
export function FilesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const documents = useSelector(selectDocuments);
  const collaborators = useSelector(selectCollaborators);

  const [searchTerm, setSearchTerm] = useState('');
  const [kindFilter, setKindFilter] = useState<DocumentKind | 'all'>('all');
  const [collaboratorFilter, setCollaboratorFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (documents.length === 0) {
          await dispatch(fetchDocuments()).unwrap();
        }
        if (collaborators.length === 0) {
          await dispatch(fetchCollaborators(undefined)).unwrap();
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch, documents.length, collaborators.length]);

  // Filtrar documentos
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter((doc) => doc.isActive);

    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((doc) => {
        const collaborator = collaborators.find((c) => c.id === doc.collaboratorId);
        const collaboratorName = collaborator
          ? `${collaborator.nombre} ${collaborator.apellidos}`.toLowerCase()
          : '';
        return (
          doc.fileName.toLowerCase().includes(searchLower) ||
          doc.descripcion?.toLowerCase().includes(searchLower) ||
          collaboratorName.includes(searchLower) ||
          collaborator?.rpe.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filtro por tipo
    if (kindFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.kind === kindFilter);
    }

    // Filtro por colaborador
    if (collaboratorFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.collaboratorId === collaboratorFilter);
    }

    return filtered;
  }, [documents, collaborators, searchTerm, kindFilter, collaboratorFilter]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const activeDocs = documents.filter((d) => d.isActive);
    return {
      total: activeDocs.length,
      bateria: activeDocs.filter((d) => d.kind === 'bateria').length,
      historial: activeDocs.filter((d) => d.kind === 'historial').length,
      perfil: activeDocs.filter((d) => d.kind === 'perfil').length,
      constancia: activeDocs.filter((d) => d.kind === 'constancia').length,
      otro: activeDocs.filter((d) => d.kind === 'otro').length,
    };
  }, [documents]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setKindFilter('all');
    setCollaboratorFilter('all');
  };

  const hasActiveFilters =
    searchTerm || kindFilter !== 'all' || collaboratorFilter !== 'all';

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>Cargando documentos...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Gestión de Archivos</h1>
          <p className={styles.subtitle}>
            Administra y consulta todos los documentos del sistema
          </p>
        </div>
      </header>

      {/* Estadísticas */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.bateria}</span>
          <span className={styles.statLabel}>Baterías</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.historial}</span>
          <span className={styles.statLabel}>Historiales</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.perfil}</span>
          <span className={styles.statLabel}>Perfiles</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.constancia}</span>
          <span className={styles.statLabel}>Constancias</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.otro}</span>
          <span className={styles.statLabel}>Otros</span>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, colaborador o RPE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as DocumentKind | 'all')}
            className={styles.filterSelect}
          >
            <option value="all">Todos los tipos</option>
            <option value="bateria">Batería</option>
            <option value="historial">Historial</option>
            <option value="perfil">Perfil</option>
            <option value="constancia">Constancia</option>
            <option value="otro">Otro</option>
          </select>

          <select
            value={collaboratorFilter}
            onChange={(e) => setCollaboratorFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos los colaboradores</option>
            {collaborators
              .filter((c) => c.isActive)
              .map((collaborator) => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.nombre} {collaborator.apellidos} ({collaborator.rpe})
                </option>
              ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className={styles.clearButton}
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de documentos */}
      <div className={styles.content}>
        {filteredDocuments.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {hasActiveFilters
                ? 'No se encontraron documentos con los filtros aplicados'
                : 'No hay documentos en el sistema'}
            </p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className={styles.clearButton}>
                Limpiar Filtros
              </button>
            )}
          </div>
        ) : (
          <div className={styles.documentGrid}>
            {filteredDocuments.map((doc) => {
              const collaborator = collaborators.find((c) => c.id === doc.collaboratorId);
              return (
                <div key={doc.id} className={styles.documentCard}>
                  <div className={styles.documentHeader}>
                    <div className={styles.documentType}>
                      {getDocumentKindLabel(doc.kind)}
                    </div>
                    <span className={styles.documentDate}>
                      {new Date(doc.uploadedAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>

                  <h3 className={styles.documentName}>{doc.fileName}</h3>

                  {doc.descripcion && (
                    <p className={styles.documentDescription}>{doc.descripcion}</p>
                  )}

                  {doc.periodo && (
                    <span className={styles.documentPeriodo}>
                      Período: {doc.periodo}
                    </span>
                  )}

                  {collaborator && (
                    <div className={styles.documentCollaborator}>
                      <Link
                        to={buildRoute.collaboratorDetail(collaborator.id)}
                        className={styles.collaboratorLink}
                      >
                        👤 {collaborator.nombre} {collaborator.apellidos} ({collaborator.rpe})
                      </Link>
                    </div>
                  )}

                  <div className={styles.documentActions}>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewButton}
                    >
                      👁️ Ver
                    </a>
                    {collaborator && (
                      <Link
                        to={buildRoute.collaboratorDetail(collaborator.id)}
                        className={styles.detailButton}
                      >
                        📁 Expediente
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
