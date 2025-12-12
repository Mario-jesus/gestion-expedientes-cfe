import type { DocumentKind } from '@entities/collaborator';

export interface UploadDocumentFormData {
  file: File | null;
  periodo?: string;
  descripcion?: string;
}

export interface UploadDocumentErrors {
  file?: string;
  periodo?: string;
  descripcion?: string;
}

/**
 * Validación del formulario de subida de documento
 */
export function validateUploadDocument(
  data: UploadDocumentFormData,
  kind: DocumentKind
): UploadDocumentErrors {
  const errors: UploadDocumentErrors = {};

  // Validar archivo
  if (!data.file) {
    errors.file = 'Debe seleccionar un archivo';
  } else {
    // Validar tipo de archivo (solo PDF e imágenes)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    if (!allowedTypes.includes(data.file.type)) {
      errors.file = 'Solo se permiten archivos PDF, JPG o PNG';
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (data.file.size > maxSize) {
      errors.file = 'El archivo no debe exceder 10MB';
    }
  }

  // Validar periodo (requerido para historial y constancias)
  if ((kind === 'historial' || kind === 'constancia') && !data.periodo?.trim()) {
    errors.periodo = 'El período es requerido para este tipo de documento';
  }

  // Validar descripción (opcional pero con límite de caracteres)
  if (data.descripcion && data.descripcion.length > 500) {
    errors.descripcion = 'La descripción no debe exceder 500 caracteres';
  }

  return errors;
}
