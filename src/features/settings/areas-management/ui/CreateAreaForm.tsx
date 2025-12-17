import { useState, type FormEvent } from 'react';
import { catalogsApi } from '@entities/collaborator';
import { Input, Button } from '@shared/ui';
import styles from './CatalogForm.module.scss';

interface CreateAreaFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para crear una nueva área
 */
export function CreateAreaForm({
  onSuccess,
  onCancel,
}: CreateAreaFormProps) {
  const [nombre, setNombre] = useState('');
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

    setIsLoading(true);

    try {
      await catalogsApi.areas.create({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear el área';
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
          Crear Área
        </Button>
      </div>
    </form>
  );
}
