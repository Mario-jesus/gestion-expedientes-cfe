import { useState, type FormEvent } from 'react';
import type { CollaboratorDocument } from '@entities/collaborator';
import { useEditDocument } from '../model/useEditDocument';
import { Input, Button } from '@shared/ui';
import styles from './EditDocumentForm.module.scss';

interface EditDocumentFormProps {
  document: CollaboratorDocument;
  collaboratorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para editar metadatos de un documento
 */
export function EditDocumentForm({
  document,
  collaboratorId,
  onSuccess,
  onCancel,
}: EditDocumentFormProps) {
  const [fileName, setFileName] = useState(document.fileName);
  const [descripcion, setDescripcion] = useState(document.descripcion || '');
  const [periodo, setPeriodo] = useState(document.periodo || '');

  const { editDocument, isLoading, errors, submitError, clearFieldError } =
    useEditDocument(document, collaboratorId, onSuccess);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    editDocument({
      fileName,
      descripcion: descripcion.trim() || undefined,
      periodo: periodo.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {submitError && (
        <div className={styles.submitError}>{submitError}</div>
      )}

      <Input
        label="Nombre del Archivo *"
        type="text"
        value={fileName}
        onChange={(e) => {
          setFileName(e.target.value);
          clearFieldError('fileName');
        }}
        disabled={isLoading}
        placeholder="Nombre del archivo"
        error={errors.fileName}
      />

      <Input
        label="Descripción (opcional)"
        type="text"
        value={descripcion}
        onChange={(e) => {
          setDescripcion(e.target.value);
          clearFieldError('descripcion');
        }}
        disabled={isLoading}
        placeholder="Ej: Batería de capacitación inicial 2024"
        error={errors.descripcion}
      />

      {(document.kind === 'historial' || document.kind === 'constancia') && (
        <Input
          label="Período (opcional)"
          type="text"
          value={periodo}
          onChange={(e) => {
            setPeriodo(e.target.value);
            clearFieldError('periodo');
          }}
          disabled={isLoading}
          placeholder="Ej: 2024-Q1, 2024"
          error={errors.periodo}
        />
      )}

      <div className={styles.info}>
        <p className={styles.infoText}>
          <strong>Tipo de documento:</strong> {document.kind}
        </p>
        <p className={styles.infoText}>
          <strong>Subido:</strong>{' '}
          {new Date(document.uploadedAt).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
