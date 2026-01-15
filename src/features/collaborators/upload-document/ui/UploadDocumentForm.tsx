import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { DocumentKind } from '@entities/collaborator';
import { useUploadDocument } from '../model/useUploadDocument';
import { Input, Button } from '@shared/ui';
import styles from './UploadDocumentForm.module.scss';

interface UploadDocumentFormProps {
  collaboratorId: string;
  defaultKind?: DocumentKind;
  onSuccess: () => void;
  onCancel: () => void;
}

const DOCUMENT_KINDS: { value: DocumentKind; label: string }[] = [
  { value: 'perfil', label: 'Perfil de Puesto' },
  { value: 'bateria', label: 'Batería' },
  { value: 'historial', label: 'Historial de Capacitación' },
  { value: 'cchl', label: 'CCHL' },
  { value: 'c0_03', label: 'Formato C0-03' },
  { value: 'constancia', label: 'Constancias' },
];

/**
 * Formulario para cargar un documento al expediente de un colaborador
 */
export function UploadDocumentForm({
  collaboratorId,
  defaultKind,
  onSuccess,
  onCancel,
}: UploadDocumentFormProps) {
  const [kind, setKind] = useState<DocumentKind>(defaultKind || 'bateria');
  const [file, setFile] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [periodo, setPeriodo] = useState('');

  const { uploadDocument, isLoading, errors, submitError, clearFieldError } =
    useUploadDocument(collaboratorId, onSuccess);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      clearFieldError('file');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    uploadDocument({
      kind,
      file,
      descripcion: descripcion.trim() || undefined,
      periodo: periodo.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {submitError && (
        <div className={styles.submitError}>{submitError}</div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>
          Tipo de Documento <span className={styles.required}>*</span>
        </label>
        <select
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as DocumentKind);
            clearFieldError('kind');
          }}
          className={styles.select}
          disabled={isLoading}
        >
          {DOCUMENT_KINDS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.kind && <span className={styles.error}>{errors.kind}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Archivo <span className={styles.required}>*</span>
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={handleFileChange}
          className={styles.fileInput}
          disabled={isLoading}
        />
        {file && (
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        )}
        {errors.file && <span className={styles.error}>{errors.file}</span>}
        <p className={styles.helpText}>
          Formatos permitidos: PDF, JPG, PNG (máximo 10MB)
        </p>
      </div>

      <Input
        label="Descripción (opcional)"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={isLoading}
        placeholder="Ej: Batería de capacitación inicial 2024"
      />

      {(kind === 'historial' || kind === 'constancia') && (
        <Input
          label="Período (opcional)"
          type="text"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          disabled={isLoading}
          placeholder="Ej: 2024-Q1, 2024"
        />
      )}

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!file}>
          Subir Documento
        </Button>
      </div>
    </form>
  );
}
