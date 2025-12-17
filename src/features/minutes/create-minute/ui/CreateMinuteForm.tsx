import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { MinuteType } from '@entities/minute';
import { useCreateMinute } from '../model/useCreateMinute';
import { Input, Button } from '@shared/ui';
import styles from './CreateMinuteForm.module.scss';

interface CreateMinuteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MINUTE_TYPES: { value: MinuteType; label: string }[] = [
  { value: 'reunion', label: 'Reunión' },
  { value: 'junta', label: 'Junta' },
  { value: 'acuerdo', label: 'Acuerdo' },
  { value: 'memorandum', label: 'Memorándum' },
  { value: 'otro', label: 'Otro' },
];

/**
 * Formulario para crear/subir una nueva minuta
 */
export function CreateMinuteForm({
  onSuccess,
  onCancel,
}: CreateMinuteFormProps) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<MinuteType>('reunion');
  const [fecha, setFecha] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { create, isLoading, errors, submitError, clearFieldError } =
    useCreateMinute(onSuccess);

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

    create({
      titulo,
      tipo,
      fecha,
      descripcion: descripcion.trim() || undefined,
      file,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {submitError && (
        <div className={styles.submitError}>{submitError}</div>
      )}

      <Input
        label="Título"
        type="text"
        value={titulo}
        onChange={(e) => {
          setTitulo(e.target.value);
          clearFieldError('titulo');
        }}
        disabled={isLoading}
        required
        error={errors.titulo}
        placeholder="Ej: Minuta de reunión de seguridad"
      />

      <div className={styles.field}>
        <label className={styles.label}>
          Tipo de Minuta <span className={styles.required}>*</span>
        </label>
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value as MinuteType);
            clearFieldError('tipo');
          }}
          className={styles.select}
          disabled={isLoading}
        >
          {MINUTE_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
      </div>

      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => {
          setFecha(e.target.value);
          clearFieldError('fecha');
        }}
        disabled={isLoading}
        required
        error={errors.fecha}
      />

      <Input
        label="Descripción (opcional)"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={isLoading}
        placeholder="Breve descripción de la minuta"
      />

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

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={!file || !titulo || !fecha}>
          Crear Minuta
        </Button>
      </div>
    </form>
  );
}
