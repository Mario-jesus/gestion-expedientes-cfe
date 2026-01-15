import { useState, type FormEvent } from 'react';
import type { DocumentType, DocumentKind } from '@entities/collaborator';
import { catalogsApi, getDocumentKindLabel } from '@entities/collaborator';
import { Input, Button } from '@shared/ui';
import styles from '../../areas-management/ui/CatalogForm.module.scss';

const DOCUMENT_KINDS: DocumentKind[] = ['perfil', 'bateria', 'historial', 'cchl', 'c0_03', 'constancia'];

interface EditDocumentTypeFormProps {
  documentType: DocumentType;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditDocumentTypeForm({
  documentType,
  onSuccess,
  onCancel,
}: EditDocumentTypeFormProps) {
  const [nombre, setNombre] = useState(documentType.nombre);
  const [kind, setKind] = useState<DocumentKind>(documentType.kind);
  const [descripcion, setDescripcion] = useState(documentType.descripcion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setIsLoading(true);

    try {
      await catalogsApi.documentTypes.update(documentType.id, {
        nombre: nombre.trim(),
        kind,
        descripcion: descripcion.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar el tipo de documento';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label}>
          Tipo Principal <span className={styles.required}>*</span>
        </label>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as DocumentKind)}
          disabled={isLoading}
          className={styles.select}
        >
          {DOCUMENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {getDocumentKindLabel(k)}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Nombre *"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        disabled={isLoading}
        required
        placeholder="Ej: Certificado de Capacitación"
      />

      <Input
        label="Descripción (opcional)"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={isLoading}
        placeholder="Breve descripción del tipo"
      />

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
