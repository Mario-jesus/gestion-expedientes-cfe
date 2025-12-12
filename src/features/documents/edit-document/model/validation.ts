export interface EditDocumentFormData {
  periodo?: string;
  descripcion?: string;
}

export interface EditDocumentErrors {
  periodo?: string;
  descripcion?: string;
}

/**
 * Validación del formulario de edición de documento
 */
export function validateEditDocument(
  data: EditDocumentFormData,
  requiresPeriodo: boolean
): EditDocumentErrors {
  const errors: EditDocumentErrors = {};

  // Validar periodo (requerido si aplica)
  if (requiresPeriodo && !data.periodo?.trim()) {
    errors.periodo = 'El período es requerido para este tipo de documento';
  }

  // Validar descripción (opcional pero con límite de caracteres)
  if (data.descripcion && data.descripcion.length > 500) {
    errors.descripcion = 'La descripción no debe exceder 500 caracteres';
  }

  return errors;
}
