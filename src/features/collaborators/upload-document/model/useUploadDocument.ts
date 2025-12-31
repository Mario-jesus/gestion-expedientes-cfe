import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { createDocument, fetchDocumentsByCollaborator } from '@entities/collaborator';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';
import type { DocumentKind } from '@entities/collaborator';

interface UploadDocumentErrors {
  kind?: string;
  file?: string;
  general?: string;
}

export function useUploadDocument(
  collaboratorId: string,
  onSuccess?: () => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<UploadDocumentErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearFieldError = (field: keyof UploadDocumentErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const uploadDocument = async (data: {
    kind: DocumentKind;
    file: File;
    descripcion?: string;
    periodo?: string;
  }) => {
    // Validar
    const newErrors: UploadDocumentErrors = {};

    if (!data.kind) {
      newErrors.kind = 'El tipo de documento es requerido';
    }

    if (!data.file) {
      newErrors.file = 'El archivo es requerido';
    } else {
      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (data.file.size > maxSize) {
        newErrors.file = 'El archivo no puede ser mayor a 10MB';
      }

      // Validar tipo de archivo (solo PDF e imágenes)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      if (!allowedTypes.includes(data.file.type)) {
        newErrors.file = 'Solo se permiten archivos PDF, JPG o PNG';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSubmitError(null);

    try {
      logger.info('Subiendo documento...', {
        fileName: data.file.name,
        kind: data.kind,
        collaboratorId,
      });

      // Llamar al thunk con el File directamente
      await dispatch(createDocument({
        file: data.file,
        collaboratorId,
        kind: data.kind,
        descripcion: data.descripcion,
        periodo: data.periodo,
      })).unwrap();

      // Recargar documentos del colaborador
      await dispatch(fetchDocumentsByCollaborator(collaboratorId));

      logger.info('Documento subido exitosamente');
      showSuccess('Documento subido exitosamente');
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al subir el documento';
      logger.error('Error subiendo documento:', error);
      setSubmitError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadDocument,
    isLoading,
    errors,
    submitError,
    clearFieldError,
  };
}
