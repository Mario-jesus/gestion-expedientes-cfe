import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { updateDocumentThunk, fetchDocumentsByCollaborator } from '@entities/collaborator';
import type { UpdateDocumentDto, CollaboratorDocument } from '@entities/collaborator';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';

interface EditDocumentErrors {
  fileName?: string;
  descripcion?: string;
  periodo?: string;
}

/**
 * Hook para editar metadatos de un documento
 */
export function useEditDocument(
  document: CollaboratorDocument,
  collaboratorId: string,
  onSuccess: () => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<EditDocumentErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearFieldError = (field: keyof EditDocumentErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = (data: UpdateDocumentDto): boolean => {
    const newErrors: EditDocumentErrors = {};

    if (data.fileName !== undefined) {
      if (!data.fileName.trim()) {
        newErrors.fileName = 'El nombre del archivo es requerido';
      } else if (data.fileName.trim().length < 3) {
        newErrors.fileName = 'El nombre debe tener al menos 3 caracteres';
      } else if (data.fileName.trim().length > 255) {
        newErrors.fileName = 'El nombre no puede exceder 255 caracteres';
      }
    }

    if (data.descripcion !== undefined && data.descripcion.trim().length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    if (data.periodo !== undefined && data.periodo.trim().length > 50) {
      newErrors.periodo = 'El período no puede exceder 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const editDocument = async (data: UpdateDocumentDto) => {
    setSubmitError(null);
    setErrors({});

    if (!validate(data)) {
      return;
    }

    setIsLoading(true);

    try {
      const updateData: UpdateDocumentDto = {};

      if (data.fileName !== undefined && data.fileName.trim() !== document.fileName) {
        updateData.fileName = data.fileName.trim();
      }

      if (data.descripcion !== undefined) {
        updateData.descripcion = data.descripcion.trim() || undefined;
      }

      if (data.periodo !== undefined) {
        updateData.periodo = data.periodo.trim() || undefined;
      }

      // Solo actualizar si hay cambios
      if (Object.keys(updateData).length === 0) {
        logger.info('No hay cambios para actualizar');
        setIsLoading(false);
        onSuccess();
        return;
      }

      await dispatch(
        updateDocumentThunk({
          id: document.id,
          data: updateData,
        })
      ).unwrap();

      // Recargar documentos del colaborador
      await dispatch(fetchDocumentsByCollaborator(collaboratorId));

      logger.info('Documento actualizado exitosamente');
      showSuccess('Documento actualizado exitosamente');
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el documento. Intenta nuevamente.';
      logger.error('Error actualizando documento:', error);
      setSubmitError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editDocument,
    isLoading,
    errors,
    submitError,
    clearFieldError,
  };
}
