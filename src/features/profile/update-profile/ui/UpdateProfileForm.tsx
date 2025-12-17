import { useState, type FormEvent } from 'react';
import type { User } from '@entities/user';
import { usersApi, setUser } from '@entities/user';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { Input, Button } from '@shared/ui';
import styles from './UpdateProfileForm.module.scss';

interface UpdateProfileFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para actualizar información personal del usuario
 */
export function UpdateProfileForm({
  user,
  onSuccess,
  onCancel,
}: UpdateProfileFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!email.trim()) {
      setError('El correo electrónico es requerido');
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('El correo electrónico no es válido');
      return;
    }

    setIsLoading(true);

    try {
      const updatedUser = await usersApi.update(user.id, {
        name: name.trim(),
        email: email.trim(),
      });

      // Actualizar el usuario en el store
      dispatch(setUser(updatedUser));

      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar la información';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.info}>
        <p className={styles.infoText}>
          <strong>Nombre de usuario:</strong> {user.username}
        </p>
        <p className={styles.infoText}>
          El nombre de usuario no se puede cambiar.
        </p>
      </div>

      <Input
        label="Nombre Completo *"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
        required
        placeholder="Tu nombre completo"
      />

      <Input
        label="Correo Electrónico *"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
        placeholder="tu@email.com"
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
