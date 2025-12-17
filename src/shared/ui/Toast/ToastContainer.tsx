import { ToastComponent, type Toast } from './Toast';
import styles from './ToastContainer.module.scss';

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

/**
 * Contenedor para mostrar múltiples toasts
 */
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
