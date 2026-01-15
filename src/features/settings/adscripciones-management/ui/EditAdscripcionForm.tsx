import { useState, type FormEvent } from 'react';
import type { Adscripcion } from '@entities/collaborator';
import { catalogsApi } from '@entities/collaborator';
import { Input, Button } from '@shared/ui';
import styles from '../../areas-management/ui/CatalogForm.module.scss';

interface EditAdscripcionFormProps {
  adscripcion: Adscripcion;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para editar una adscripción existente
 */
export function EditAdscripcionForm({
  adscripcion,
  onSuccess,
  onCancel,
}: EditAdscripcionFormProps) {
  const [nombre, setNombre] = useState(adscripcion.nombre);
  const [adscripcionValue, setAdscripcion] = useState(adscripcion.adscripcion || '');
  const [descripcion, setDescripcion] = useState(adscripcion.descripcion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!adscripcionValue.trim()) {
      setError('La adscripción es requerida');
      return;
    }

    setIsLoading(true);

    try {
      await catalogsApi.adscripciones.update(adscripcion.id, {
        nombre: nombre.trim(),
        adscripcion: adscripcionValue.trim(),
        descripcion: descripcion.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar la adscripción';
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
        placeholder="Ej: Zona Ríos"
      />

      <Input
        label="Adscripción *"
        type="text"
        value={adscripcionValue}
        onChange={(e) => setAdscripcion(e.target.value)}
        disabled={isLoading}
        required
        placeholder="Ej: Area benemérito, Agencia benemérita"
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
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
