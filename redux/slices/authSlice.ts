// src/store/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { tokenStorage } from "@/services/api";
export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
  lastModified: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
interface AuthState {
  userId: string | null;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  userId: null,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginUser(state, action: PayloadAction<AuthState["user"]>) {
      state.user = action.payload;
    },
    setLoginUserId(state, action: PayloadAction<AuthState["userId"]>) {
      state.userId = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.userId = null;
      state.token = null;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

// Initialize from storage
export const initUserFromStore = () => async (dispatch: any) => {
  const token = await tokenStorage.getToken();
  if (token) {
    dispatch(authActions.setToken(token));
    // You can also fetch user profile here if needed
  }
};