import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { createDocument } from '@entities/collaborator/model/documentsThunks';
import type { CreateDocumentDto, DocumentKind } from '@entities/collaborator';
import { logger } from '@shared/config';

interface UseUploadDocumentOptions {
  collaboratorId: string;
  kind: DocumentKind;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useUploadDocument({
  collaboratorId,
  kind,
  onSuccess,
  onError,
}: UseUploadDocumentOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (file: File, metadata?: { periodo?: string; descripcion?: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      // En un mock API, simulamos la subida del archivo
      // En producción, aquí se subiría el archivo a un servicio de almacenamiento
      const fileUrl = URL.createObjectURL(file); // Temporal: en producción sería la URL del servidor
      
      // Simular URL del servidor (en producción vendría del backend)
      const simulatedFileUrl = `/docs/${collaboratorId}/${kind}/${Date.now()}_${file.name}`;

      const documentData: CreateDocumentDto = {
        collaboratorId,
        kind,
        fileName: file.name,
        fileUrl: simulatedFileUrl,
        fileSize: file.size,
        fileType: file.type,
        periodo: metadata?.periodo,
        descripcion: metadata?.descripcion,
      };

      logger.info('Subiendo documento...', documentData);
      await dispatch(createDocument(documentData)).unwrap();

      logger.info('Documento subido exitosamente');
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al subir el documento';
      logger.error('Error subiendo documento:', err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadDocument,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
