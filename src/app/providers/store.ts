import { configureStore } from '@reduxjs/toolkit';
import { userReducer, usersManagementReducer } from '@entities/user';
import { loginReducer } from '@features/auth/login';

export const store = configureStore({
  reducer: {
    user: userReducer,
    usersManagement: usersManagementReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
