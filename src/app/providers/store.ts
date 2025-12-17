import { configureStore } from '@reduxjs/toolkit';
import { userReducer, usersManagementReducer } from '@entities/user';
import {
  collaboratorsManagementReducer,
  documentsManagementReducer,
} from '@entities/collaborator';
import { minutesManagementReducer } from '@entities/minute';
import { loginReducer } from '@features/auth/login';

export const store = configureStore({
  reducer: {
    user: userReducer,
    usersManagement: usersManagementReducer,
    collaboratorsManagement: collaboratorsManagementReducer,
    documentsManagement: documentsManagementReducer,
    minutesManagement: minutesManagementReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
