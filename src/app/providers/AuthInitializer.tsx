import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { validateToken } from '@entities/user';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Componente que valida el token al iniciar la aplicación
 * Muestra un loading mientras valida la sesión
 */
export function AuthInitializer({ children }: AuthInitializerProps) {
  const [isValidating, setIsValidating] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initAuth = async () => {
      await dispatch(validateToken());
      setIsValidating(false);
    };

    initAuth();
  }, [dispatch]);

  // Mostrar loading mientras valida
  if (isValidating) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #646cff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Validando sesión...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
