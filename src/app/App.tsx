import { Provider } from 'react-redux';
import { AppRouter } from './providers/router';
import { store, AuthInitializer } from './providers';

export function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <AppRouter />
      </AuthInitializer>
    </Provider>
  );
}
