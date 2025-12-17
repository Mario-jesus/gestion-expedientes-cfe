import { useEffect } from 'react';
import styles from './Toast.module.scss';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number; // Duración en milisegundos, undefined = no auto-close
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

/**
 * Componente individual de Toast
 */
export function ToastComponent({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== undefined && toast.duration > 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.variant) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[toast.variant]}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>{getIcon()}</span>
        <span className={styles.toastMessage}>{toast.message}</span>
      </div>
      <button
        className={styles.toastClose}
        onClick={() => onClose(toast.id)}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}
