import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import type { User, UpdateUserDto } from '@entities/user';
import { useEditUser } from '../model/useEditUser';
import styles from './EditUser.module.scss';

interface EditUserFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para editar un usuario existente
 * No permite cambiar el username (es único e inmutable)
 */
export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState<UpdateUserDto>({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });

  const { editUser, isLoading, errors, submitError, clearFieldError } =
    useEditUser(user.id, onSuccess);

  // Actualizar el formulario si cambia el usuario
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  }, [user]);

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
    await editUser(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Username (solo lectura) */}
      <div className={styles.formGroup}>
        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          value={user.username}
          disabled
          className={styles.readOnly}
        />
        <span className={styles.hint}>
          El nombre de usuario no se puede modificar
        </span>
      </div>

      {/* Nombre */}
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

      {/* Email */}
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

      {/* Rol */}
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
          <option value="operator">Operador</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.role && <span className={styles.error}>{errors.role}</span>}
        <span className={styles.hint}>
          Cambiar el rol afectará los permisos del usuario
        </span>
      </div>

      {/* Estado activo */}
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
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
}
