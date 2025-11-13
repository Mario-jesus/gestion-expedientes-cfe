import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { CreateUserDto, UserRole } from '@entities/user';
import { useCreateUser } from '../model/useCreateUser';
import styles from './CreateUser.module.scss';

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para crear un nuevo usuario
 * Permite seleccionar si será admin u operador
 */
export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    email: '',
    password: '',
    name: '',
    role: '' as UserRole,
    isActive: true,
  });

  const { createUser, isLoading, errors, submitError, clearFieldError } =
    useCreateUser(onSuccess);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof typeof errors]) {
      clearFieldError(name as keyof typeof errors);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createUser(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">
          Nombre completo <span className={styles.required}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez García"
          disabled={isLoading}
          className={errors.name ? styles.inputError : ''}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="username">
          Usuario <span className={styles.required}>*</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Ej: jperez"
          disabled={isLoading}
          className={errors.username ? styles.inputError : ''}
        />
        {errors.username && (
          <span className={styles.error}>{errors.username}</span>
        )}
        <span className={styles.hint}>
          Solo letras, números, guiones y guiones bajos (mínimo 4 caracteres)
        </span>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">
          Correo electrónico <span className={styles.required}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ej: juan.perez@cfe.mx"
          disabled={isLoading}
          className={errors.email ? styles.inputError : ''}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">
          Contraseña <span className={styles.required}>*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mínimo 8 caracteres"
          disabled={isLoading}
          className={errors.password ? styles.inputError : ''}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
        <span className={styles.hint}>
          Debe contener mayúsculas, minúsculas y números
        </span>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="role">
          Rol <span className={styles.required}>*</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={isLoading}
          className={errors.role ? styles.inputError : ''}
        >
          <option value="">Seleccionar rol</option>
          <option value="operator">Operador</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.role && <span className={styles.error}>{errors.role}</span>}
        <span className={styles.hint}>
          Operadores gestionan expedientes, Administradores gestionan usuarios
        </span>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.checkboxGroup}>
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            disabled={isLoading}
          />
          <label htmlFor="isActive" className={styles.checkboxLabel}>
            Usuario activo
          </label>
        </div>
        <span className={styles.hint}>
          Los usuarios inactivos no podrán iniciar sesión en el sistema
        </span>
      </div>

      {submitError && (
        <div className={styles.submitError}>
          <strong>Error:</strong> {submitError}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
}
