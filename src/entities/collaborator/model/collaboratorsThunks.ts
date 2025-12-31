import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@app/providers/store';
import { logger } from '@shared/config';
import { collaboratorsApi } from '../api/collaboratorsApi';
import type {
  Collaborator,
  CreateCollaboratorDto,
  UpdateCollaboratorDto,
  CollaboratorFilters,
} from './types';
import {
  setCollaborators,
  setLoading,
  setError,
  addCollaborator,
  updateCollaborator,
  removeCollaborator,
} from './collaboratorsManagementSlice';

/**
 * Thunk para obtener todos los colaboradores
 */
export const fetchCollaborators = createAsyncThunk<
  Collaborator[],
  CollaboratorFilters | undefined,
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/fetchAll',
  async (filters, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info('Obteniendo colaboradores...', filters);

      const response = await collaboratorsApi.getAll(filters);

      dispatch(setCollaborators(response.data));
      logger.info(`Se obtuvieron ${response.data.length} colaboradores de ${response.pagination.total} totales`);

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener colaboradores';
      logger.error('Error obteniendo colaboradores:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para obtener un colaborador por ID
 */
export const fetchCollaboratorById = createAsyncThunk<
  Collaborator,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/fetchById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Obteniendo colaborador ${id}...`);

      const collaborator = await collaboratorsApi.getById(id);

      // Actualizar en la lista si existe, o agregarlo si no existe
      dispatch(updateCollaborator(collaborator));
      dispatch(setLoading(false));

      logger.info('Colaborador obtenido:', collaborator);
      return collaborator;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener colaborador';
      logger.error('Error obteniendo colaborador:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para crear un nuevo colaborador
 */
export const createCollaborator = createAsyncThunk<
  Collaborator,
  CreateCollaboratorDto,
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/create',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info('Creando colaborador...', data);

      const newCollaborator = await collaboratorsApi.create(data);

      dispatch(addCollaborator(newCollaborator));
      logger.info('Colaborador creado:', newCollaborator);

      return newCollaborator;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear colaborador';
      logger.error('Error creando colaborador:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para actualizar un colaborador existente
 */
export const updateCollaboratorThunk = createAsyncThunk<
  Collaborator,
  { id: string; data: UpdateCollaboratorDto },
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Actualizando colaborador ${id}...`, data);

      const updatedCollaborator = await collaboratorsApi.update(id, data);

      dispatch(updateCollaborator(updatedCollaborator));
      logger.info('Colaborador actualizado:', updatedCollaborator);

      return updatedCollaborator;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar colaborador';
      logger.error('Error actualizando colaborador:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para eliminar un colaborador (baja lógica)
 */
export const deleteCollaborator = createAsyncThunk<
  string,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Eliminando colaborador ${id}...`);

      await collaboratorsApi.delete(id);

      dispatch(removeCollaborator(id));
      logger.info('Colaborador eliminado:', id);

      return id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al eliminar colaborador';
      logger.error('Error eliminando colaborador:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para activar un colaborador
 */
export const activateCollaborator = createAsyncThunk<
  Collaborator,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/activate',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Activando colaborador ${id}...`);

      const updatedCollaborator = await collaboratorsApi.activate(id);

      dispatch(updateCollaborator(updatedCollaborator));
      logger.info('Colaborador activado:', updatedCollaborator);

      return updatedCollaborator;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al activar colaborador';
      logger.error('Error activando colaborador:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para desactivar un colaborador
 */
export const deactivateCollaborator = createAsyncThunk<
  Collaborator,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/deactivate',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Desactivando colaborador ${id}...`);

      const updatedCollaborator = await collaboratorsApi.deactivate(id);

      dispatch(updateCollaborator(updatedCollaborator));
      logger.info('Colaborador desactivado:', updatedCollaborator);

      return updatedCollaborator;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al desactivar colaborador';
      logger.error('Error desactivando colaborador:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);
