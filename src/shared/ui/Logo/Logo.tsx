import styles from './Logo.module.scss';

export function Logo() {
  return (
    <div className={styles.container}>
      <span className={styles.brand}>CFE</span>
      <span className={styles.subtitle}>Comisión Federal de Electricidad</span>
    </div>
  );
}
