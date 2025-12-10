import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@app/providers/store';
import { logger } from '@shared/config';
import { documentsApi } from '../api/documentsApi';
import type {
  CollaboratorDocument,
  CreateDocumentDto,
  UpdateDocumentDto,
} from './types';
import {
  setDocuments,
  setCollaboratorDocuments,
  setLoading,
  setError,
  addDocument,
  updateDocument,
  removeDocument,
} from './documentsManagementSlice';

/**
 * Thunk para obtener todos los documentos
 */
export const fetchDocuments = createAsyncThunk<
  CollaboratorDocument[],
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  'documents/fetchAll',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info('Obteniendo documentos...');

      const documents = await documentsApi.getAll();

      dispatch(setDocuments(documents));
      logger.info(`Se obtuvieron ${documents.length} documentos`);

      return documents;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener documentos';
      logger.error('Error obteniendo documentos:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para obtener documentos de un colaborador específico
 */
export const fetchDocumentsByCollaborator = createAsyncThunk<
  CollaboratorDocument[],
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'documents/fetchByCollaborator',
  async (collaboratorId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Obteniendo documentos del colaborador ${collaboratorId}...`);

      const documents = await documentsApi.getByCollaborator(collaboratorId);

      dispatch(
        setCollaboratorDocuments({ collaboratorId, documents })
      );
      logger.info(
        `Se obtuvieron ${documents.length} documentos del colaborador ${collaboratorId}`
      );

      return documents;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al obtener documentos del colaborador';
      logger.error('Error obteniendo documentos:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para obtener un documento por ID
 */
export const fetchDocumentById = createAsyncThunk<
  CollaboratorDocument,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'documents/fetchById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Obteniendo documento ${id}...`);

      const document = await documentsApi.getById(id);

      // Actualizar en la lista si existe
      dispatch(updateDocument(document));

      logger.info('Documento obtenido:', document);
      return document;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al obtener documento';
      logger.error('Error obteniendo documento:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para crear/subir un nuevo documento
 */
export const createDocument = createAsyncThunk<
  CollaboratorDocument,
  CreateDocumentDto,
  { state: RootState; dispatch: AppDispatch }
>(
  'documents/create',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info('Creando documento...', data);

      const newDocument = await documentsApi.create(data);

      dispatch(addDocument(newDocument));
      logger.info('Documento creado:', newDocument);

      return newDocument;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear documento';
      logger.error('Error creando documento:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para actualizar metadatos de un documento
 */
export const updateDocumentThunk = createAsyncThunk<
  CollaboratorDocument,
  { id: string; data: UpdateDocumentDto },
  { state: RootState; dispatch: AppDispatch }
>(
  'documents/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Actualizando documento ${id}...`, data);

      const updatedDocument = await documentsApi.update(id, data);

      dispatch(updateDocument(updatedDocument));
      logger.info('Documento actualizado:', updatedDocument);

      return updatedDocument;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar documento';
      logger.error('Error actualizando documento:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Thunk para eliminar un documento (baja lógica)
 */
export const deleteDocument = createAsyncThunk<
  string,
  string,
  { state: RootState; dispatch: AppDispatch }
>(
  'documents/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      logger.info(`Eliminando documento ${id}...`);

      await documentsApi.delete(id);

      dispatch(removeDocument(id));
      logger.info('Documento eliminado:', id);

      return id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al eliminar documento';
      logger.error('Error eliminando documento:', error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);
