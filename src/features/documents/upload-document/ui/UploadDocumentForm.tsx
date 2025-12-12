import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { DocumentKind } from '@entities/collaborator';
import { getDocumentKindLabel } from '@entities/collaborator';
import { useUploadDocument } from '../model/useUploadDocument';
import { validateUploadDocument, type UploadDocumentFormData } from '../model/validation';
import styles from './UploadDocumentForm.module.scss';

interface UploadDocumentFormProps {
  collaboratorId: string;
  kind: DocumentKind;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para subir un documento
 */
export function UploadDocumentForm({
  collaboratorId,
  kind,
  onSuccess,
  onCancel,
}: UploadDocumentFormProps) {
  const [formData, setFormData] = useState<UploadDocumentFormData>({
    file: null,
    periodo: '',
    descripcion: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UploadDocumentFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { uploadDocument, isLoading } = useUploadDocument({
    collaboratorId,
    kind,
    onSuccess,
    onError: (error) => setSubmitError(error),
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
    if (errors.file) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
  };

  const handleInputChange = (field: keyof UploadDocumentFormData) => (
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
    const validationErrors = validateUploadDocument(formData, kind);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as Partial<Record<keyof UploadDocumentFormData, string>>);
      return;
    }

    if (!formData.file) {
      return;
    }

    // Subir documento
    await uploadDocument(formData.file, {
      periodo: formData.periodo || undefined,
      descripcion: formData.descripcion || undefined,
    });
  };

  const requiresPeriodo = kind === 'historial' || kind === 'constancia';

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Subir {getDocumentKindLabel(kind)}
        </h3>

        {/* Error general */}
        {submitError && (
          <div className={styles.submitError}>
            <strong>Error:</strong> {submitError}
          </div>
        )}

        {/* Campo de archivo */}
        <div className={styles.formGroup}>
          <label htmlFor="file">
            Archivo <span className={styles.required}>*</span>
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={isLoading}
            className={errors.file ? styles.inputError : ''}
          />
          {errors.file && <span className={styles.error}>{errors.file}</span>}
          {formData.file && (
            <span className={styles.hint}>
              Archivo seleccionado: {formData.file.name} (
              {(formData.file.size / 1024).toFixed(2)} KB)
            </span>
          )}
        </div>

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
          disabled={isLoading || !formData.file}
          className={styles.submitButton}
        >
          {isLoading ? 'Subiendo...' : 'Subir Documento'}
        </button>
      </div>
    </form>
  );
}
