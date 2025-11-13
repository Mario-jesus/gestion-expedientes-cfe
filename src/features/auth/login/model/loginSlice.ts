import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LoginErrors {
  username?: string;
  password?: string;
}

interface LoginState {
  username: string;
  password: string;
  isLoading: boolean;
  submitError: string | null;
  fieldErrors: LoginErrors;
}

const initialState: LoginState = {
  username: '',
  password: '',
  isLoading: false,
  submitError: null,
  fieldErrors: {},
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
      if (state.fieldErrors.username) {
        delete state.fieldErrors.username;
      }
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
      if (state.fieldErrors.password) {
        delete state.fieldErrors.password;
      }
    },
    setFieldError(
      state,
      action: PayloadAction<{ field: keyof LoginErrors; message: string }>,
    ) {
      const { field, message } = action.payload;
      state.fieldErrors[field] = message;
    },
    setSubmitError(state, action: PayloadAction<string | null>) {
      state.submitError = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetForm() {
      return initialState;
    },
  },
});

export const {
  setUsername,
  setPassword,
  setFieldError,
  setSubmitError,
  setLoading,
  resetForm,
} = loginSlice.actions;

export const loginReducer = loginSlice.reducer;
