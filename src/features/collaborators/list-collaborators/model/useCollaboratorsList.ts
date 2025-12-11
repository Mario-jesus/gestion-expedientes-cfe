import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import {
  fetchCollaborators,
  selectCollaborators,
  selectCollaboratorsLoading,
  selectCollaboratorsError,
  selectCollaboratorsFilters,
} from '@entities/collaborator';
import type { CollaboratorFilters } from '@entities/collaborator';

/**
 * Hook para gestionar la lista de colaboradores
 * Carga colaboradores del backend y proporciona funcionalidades de filtrado
 */
export const useCollaboratorsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const collaborators = useSelector(selectCollaborators);
  const isLoading = useSelector(selectCollaboratorsLoading);
  const error = useSelector(selectCollaboratorsError);
  const filters = useSelector(selectCollaboratorsFilters);
  const hasLoadedFilters = useRef(false);
  const hasHandledSearch = useRef(false);

  /**
   * Cargar colaboradores desde el backend
   */
  const loadCollaborators = async (customFilters?: CollaboratorFilters) => {
    const filtersToUse = customFilters || filters;
    await dispatch(fetchCollaborators(filtersToUse)).unwrap();
  };

  // Cargar colaboradores al montar
  useEffect(() => {
    loadCollaborators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar cuando cambien los filtros (excepto búsqueda que se filtra en el servidor)
  useEffect(() => {
    if (!hasLoadedFilters.current) {
      hasLoadedFilters.current = true;
      return;
    }

    loadCollaborators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.areaId,
    filters.adscripcionId,
    filters.puestoId,
    filters.tipoContrato,
    filters.isActive,
    filters.estadoExpediente,
  ]);

  // Recargar cuando cambie la búsqueda (con debounce opcional)
  useEffect(() => {
    if (!hasHandledSearch.current) {
      hasHandledSearch.current = true;
      return;
    }

    const timeoutId = setTimeout(() => {
      loadCollaborators();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  /**
   * Estadísticas de colaboradores
   */
  const stats = useMemo(() => {
    return {
      total: collaborators.length,
      activos: collaborators.filter((c) => c.isActive).length,
      inactivos: collaborators.filter((c) => !c.isActive).length,
    };
  }, [collaborators]);

  return {
    collaborators,
    isLoading,
    error,
    filters,
    stats,
    refetch: () => loadCollaborators(),
  };
};
