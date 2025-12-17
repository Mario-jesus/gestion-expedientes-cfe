import { useState, type FormEvent } from 'react';
import type { Minute, MinuteType } from '@entities/minute';
import { useEditMinute } from '../model/useEditMinute';
import { Input, Button } from '@shared/ui';
import styles from './EditMinuteForm.module.scss';

interface EditMinuteFormProps {
  minute: Minute;
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
 * Formulario para editar metadatos de una minuta
 */
export function EditMinuteForm({
  minute,
  onSuccess,
  onCancel,
}: EditMinuteFormProps) {
  const [titulo, setTitulo] = useState(minute.titulo);
  const [tipo, setTipo] = useState<MinuteType>(minute.tipo);
  const [fecha, setFecha] = useState(minute.fecha.split('T')[0]);
  const [descripcion, setDescripcion] = useState(minute.descripcion || '');
  const [fileName, setFileName] = useState(minute.fileName);

  const { editMinute, isLoading, errors, submitError, clearFieldError } =
    useEditMinute(minute, onSuccess);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    editMinute({
      titulo,
      tipo,
      fecha,
      descripcion: descripcion.trim() || undefined,
      fileName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {submitError && (
        <div className={styles.submitError}>{submitError}</div>
      )}

      <Input
        label="Título *"
        type="text"
        value={titulo}
        onChange={(e) => {
          setTitulo(e.target.value);
          clearFieldError('titulo');
        }}
        disabled={isLoading}
        placeholder="Ej: Minuta de reunión de seguridad"
        error={errors.titulo}
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
        label="Fecha *"
        type="date"
        value={fecha}
        onChange={(e) => {
          setFecha(e.target.value);
          clearFieldError('fecha');
        }}
        disabled={isLoading}
        error={errors.fecha}
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
        placeholder="Breve descripción de la minuta"
        error={errors.descripcion}
      />

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

      <div className={styles.info}>
        <p className={styles.infoText}>
          <strong>Subido:</strong>{' '}
          {new Date(minute.uploadedAt).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className={styles.infoText}>
          <strong>Archivo actual:</strong> {minute.fileName}
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
