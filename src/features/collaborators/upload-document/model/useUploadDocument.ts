import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { createDocument, fetchDocumentsByCollaborator } from '@entities/collaborator';
import { logger } from '@shared/config';
import type { DocumentKind, CreateDocumentDto } from '@entities/collaborator';

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
      // Generar nombre de archivo único
      const timestamp = Date.now();
      const sanitizedFileName = data.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${data.kind}_${timestamp}_${sanitizedFileName}`;

      // En un entorno real, aquí se subiría el archivo y se obtendría la URL
      // Por ahora, simulamos la URL
      const fileUrl = `/uploads/documents/${fileName}`;

      const documentData: CreateDocumentDto = {
        collaboratorId,
        kind: data.kind,
        fileName,
        fileUrl,
        fileSize: data.file.size,
        fileType: data.file.type,
        descripcion: data.descripcion || undefined,
        periodo: data.periodo || undefined,
      };

      logger.info('Subiendo documento...', documentData);

      await dispatch(createDocument(documentData)).unwrap();

      // Recargar documentos del colaborador
      await dispatch(fetchDocumentsByCollaborator(collaboratorId));

      logger.info('Documento subido exitosamente');
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al subir el documento';
      logger.error('Error subiendo documento:', error);
      setSubmitError(errorMessage);
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
