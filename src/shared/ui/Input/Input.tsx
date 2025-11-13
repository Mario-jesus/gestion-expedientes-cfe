import { type InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <input
        className={[
          styles.input,
          error ? styles.inputError : '',
          className ?? '',
        ].join(' ')}
        {...props}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  );
}
