import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@app/providers/store';
import { logger } from '@shared/config';
import { minutesApi } from '../api/minutesApi';
import type {
  Minute,
  UpdateMinuteDto,
  MinuteFilters,
} from './types';
import {
  setMinutes,
  setLoading,
  setError,
  addMinute,
  updateMinute,
  removeMinute,
} from './minutesManagementSlice';

/**
 * Thunk para obtener todas las minutas
 */
export const fetchMinutes = createAsyncThunk<
  Minute[],
  MinuteFilters | undefined,
  { state: RootState; dispatch: AppDispatch }
>(
  'minutes/fetchAll',
  async (filters, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info('Obteniendo minutas...', filters);

      const response = await minutesApi.getAll(filters);

      dispatch(setMinutes(response.data));
      logger.info(`Se obtuvieron ${response.data.length} minutas de ${response.pagination.total} totales`);

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener minutas';
      logger.error('Error obteniendo minutas:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para obtener una minuta por ID
 */
export const fetchMinuteById = createAsyncThunk<
  Minute,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'minutes/fetchById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Obteniendo minuta ${id}...`);

      const minute = await minutesApi.getById(id);

      // Actualizar en la lista si existe, o agregarlo si no existe
      dispatch(updateMinute(minute));
      dispatch(setLoading(false));

      logger.info('Minuta obtenida:', minute);
      return minute;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener minuta';
      logger.error('Error obteniendo minuta:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para crear/subir una nueva minuta
 */
export const createMinute = createAsyncThunk<
  Minute,
  {
    file: File;
    titulo: string;
    tipo: string;
    fecha: string; // ISO string
    descripcion?: string;
  },
  { state: RootState; dispatch: AppDispatch }
>(
  'minutes/create',
  async ({ file, ...data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info('Creando minuta...', { fileName: file.name, ...data });

      const newMinute = await minutesApi.create(file, data);

      dispatch(addMinute(newMinute));
      logger.info('Minuta creada:', newMinute);

      return newMinute;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear minuta';
      logger.error('Error creando minuta:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para actualizar una minuta
 */
export const updateMinuteThunk = createAsyncThunk<
  Minute,
  { id: string; data: UpdateMinuteDto },
  { state: RootState; dispatch: AppDispatch }
>(
  'minutes/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Actualizando minuta ${id}...`, data);

      const updatedMinute = await minutesApi.update(id, data);

      dispatch(updateMinute(updatedMinute));
      logger.info('Minuta actualizada:', updatedMinute);

      return updatedMinute;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar minuta';
      logger.error('Error actualizando minuta:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para eliminar una minuta (baja lógica)
 */
export const deleteMinute = createAsyncThunk<
  string,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'minutes/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Eliminando minuta ${id}...`);

      await minutesApi.delete(id);

      dispatch(removeMinute(id));
      logger.info('Minuta eliminada:', id);

      return id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al eliminar minuta';
      logger.error('Error eliminando minuta:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);
