import { useState, type FormEvent } from 'react';
import type { Puesto } from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import { Input, Button } from '@shared/ui';
import styles from '../../areas-management/ui/CatalogForm.module.scss';

interface EditPuestoFormProps {
  puesto: Puesto;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditPuestoForm({
  puesto,
  onSuccess,
  onCancel,
}: EditPuestoFormProps) {
  const [nombre, setNombre] = useState(puesto.nombre);
  const [descripcion, setDescripcion] = useState(puesto.descripcion || '');
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
      await catalogsApi.puestos.update(puesto.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar el puesto';
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
        placeholder="Ej: Gerente de Operaciones"
      />

      <Input
        label="Descripción (opcional)"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        disabled={isLoading}
        placeholder="Breve descripción del puesto"
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
