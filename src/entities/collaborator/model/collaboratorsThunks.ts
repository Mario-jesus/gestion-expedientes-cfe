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

      const collaborators = await collaboratorsApi.getAll(filters);

      dispatch(setCollaborators(collaborators));
      logger.info(`Se obtuvieron ${collaborators.length} colaboradores`);

      return collaborators;
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
 * Thunk para alternar estado activo/inactivo
 */
export const toggleCollaboratorStatus = createAsyncThunk<
  Collaborator,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'collaborators/toggleStatus',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Alternando estado de colaborador ${id}...`);

      const updatedCollaborator = await collaboratorsApi.toggleStatus(id);

      dispatch(updateCollaborator(updatedCollaborator));
      logger.info('Estado alternado:', updatedCollaborator);

      return updatedCollaborator;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al alternar estado del colaborador';
      logger.error('Error alternando estado:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);
