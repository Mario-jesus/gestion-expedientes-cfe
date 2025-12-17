import { useState, type FormEvent } from 'react';
import type { Area } from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import { Input, Button } from '@shared/ui';
import styles from './CatalogForm.module.scss';

interface EditAreaFormProps {
  area: Area;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para editar un área existente
 */
export function EditAreaForm({
  area,
  onSuccess,
  onCancel,
}: EditAreaFormProps) {
  const [nombre, setNombre] = useState(area.nombre);
  const [descripcion, setDescripcion] = useState(area.descripcion || '');
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
      await catalogsApi.areas.update(area.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar el área';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <Input
        label="Nombre *"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        disabled={isLoading}
        required
        placeholder="Ej: Dirección General"
      />

      <Input
        label="Descripción (opcional)"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={isLoading}
        placeholder="Breve descripción del área"
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
