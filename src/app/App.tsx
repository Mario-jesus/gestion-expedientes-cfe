import { Provider } from 'react-redux';
import { AppRouter } from './providers/router';
import { store, AuthInitializer } from './providers';
import { ToastProvider } from '@shared/providers';

export function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthInitializer>
          <AppRouter />
        </AuthInitializer>
      </ToastProvider>
    </Provider>
  );
}
