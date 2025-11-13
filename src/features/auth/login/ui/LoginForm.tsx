import { type FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@app/providers';
import { Button, Input, Logo } from '@shared/ui';
import { setUsername, setPassword } from '../model/loginSlice';
import { loginUser } from '../model/loginThunks';
import styles from './LoginForm.module.scss';

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { username, password, fieldErrors, submitError, isLoading } = useSelector(
    (state: RootState) => state.login,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginUser(username, password));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Logo />

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Usuario asignado"
            placeholder="Ingresa tu nombre de usuario"
            type="text"
            value={username}
            onChange={(event) => dispatch(setUsername(event.target.value))}
            error={fieldErrors.username}
          />

          <Input
            label="Contraseña asignada"
            placeholder="Ingresa tu contraseña"
            type="password"
            value={password}
            onChange={(event) => dispatch(setPassword(event.target.value))}
            error={fieldErrors.password}
          />

          {submitError ? <p className={styles.submitError}>{submitError}</p> : null}

          <Button type="submit" isLoading={isLoading}>
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
