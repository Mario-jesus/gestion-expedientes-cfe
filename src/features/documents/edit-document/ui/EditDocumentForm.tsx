import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { CollaboratorDocument } from '@entities/collaborator';
import { useEditDocument } from '../model/useEditDocument';
import { validateEditDocument } from '../model/validation';
import styles from './EditDocumentForm.module.scss';

interface EditDocumentFormProps {
  document: CollaboratorDocument;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para editar metadatos de un documento
 */
export function EditDocumentForm({
  document,
  onSuccess,
  onCancel,
}: EditDocumentFormProps) {
  const [formData, setFormData] = useState({
    periodo: document.periodo || '',
    descripcion: document.descripcion || '',
  });
  const [errors, setErrors] = useState<Partial<Record<'periodo' | 'descripcion', string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { editDocument, isLoading } = useEditDocument({
    onSuccess,
    onError: (error) => setSubmitError(error),
  });

  const requiresPeriodo =
    document.kind === 'historial' || document.kind === 'constancia';

  const handleInputChange = (field: 'periodo' | 'descripcion') => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validar
    const validationErrors = validateEditDocument(formData, requiresPeriodo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as Partial<Record<'periodo' | 'descripcion', string>>);
      return;
    }

    // Actualizar documento
    await editDocument(document.id, {
      periodo: formData.periodo || undefined,
      descripcion: formData.descripcion || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Editar Documento</h3>
        <p className={styles.fileName}>{document.fileName}</p>

        {/* Error general */}
        {submitError && (
          <div className={styles.submitError}>
            <strong>Error:</strong> {submitError}
          </div>
        )}

        {/* Campo de período (solo para historial y constancias) */}
        {requiresPeriodo && (
          <div className={styles.formGroup}>
            <label htmlFor="periodo">
              Período <span className={styles.required}>*</span>
            </label>
            <input
              id="periodo"
              type="text"
              value={formData.periodo}
              onChange={handleInputChange('periodo')}
              placeholder="Ej: 2024-Q1, 2024, Enero 2024"
              disabled={isLoading}
              className={errors.periodo ? styles.inputError : ''}
            />
            {errors.periodo && (
              <span className={styles.error}>{errors.periodo}</span>
            )}
            <span className={styles.hint}>
              Indica el período al que corresponde este documento
            </span>
          </div>
        )}

        {/* Campo de descripción (opcional) */}
        <div className={styles.formGroup}>
          <label htmlFor="descripcion">Descripción (opcional)</label>
          <textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange('descripcion')}
            placeholder="Descripción adicional del documento..."
            rows={3}
            disabled={isLoading}
            className={errors.descripcion ? styles.inputError : ''}
            maxLength={500}
          />
          {errors.descripcion && (
            <span className={styles.error}>{errors.descripcion}</span>
          )}
          <span className={styles.hint}>
            {formData.descripcion?.length || 0}/500 caracteres
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={styles.cancelButton}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
