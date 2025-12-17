import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ToastContainer, type Toast } from '@shared/ui/Toast';

interface ToastContextType {
  showToast: (message: string, variant?: Toast['variant'], duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Provider para el sistema de notificaciones Toast
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      variant: Toast['variant'] = 'info',
      duration: number = 5000
    ) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = {
        id,
        message,
        variant,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'success', duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'error', duration || 7000); // Errores duran más por defecto
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'warning', duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'info', duration);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

/**
 * Hook para usar el sistema de toasts
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }
  return context;
}
