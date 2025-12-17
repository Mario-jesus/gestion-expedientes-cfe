import { useState, type FormEvent } from 'react';
import type { Area } from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import { Input, Button } from '@shared/ui';
import styles from '../../areas-management/ui/CatalogForm.module.scss';

interface CreateAdscripcionFormProps {
  areas: Area[];
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para crear una nueva adscripción
 */
export function CreateAdscripcionForm({
  areas,
  onSuccess,
  onCancel,
}: CreateAdscripcionFormProps) {
  const [nombre, setNombre] = useState('');
  const [areaId, setAreaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!areaId) {
      setError('Debes seleccionar un área');
      return;
    }

    setIsLoading(true);

    try {
      await catalogsApi.adscripciones.create({
        nombre: nombre.trim(),
        areaId,
        descripcion: descripcion.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear la adscripción';
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
          Área <span className={styles.required}>*</span>
        </label>
        <select
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
          disabled={isLoading}
          className={styles.select}
        >
          <option value="">Seleccionar área</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nombre}
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
        placeholder="Ej: Subdirección de Operaciones"
      />

      <Input
        label="Descripción (opcional)"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={isLoading}
        placeholder="Breve descripción de la adscripción"
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
          Crear Adscripción
        </Button>
      </div>
    </form>
  );
}
