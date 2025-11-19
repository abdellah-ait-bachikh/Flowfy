import { configureStore } from "@reduxjs/toolkit";
import { bagReducer } from "./slices/bagSlice";
import { authReducer } from "./slices/authSlice";
export const store = configureStore({
  reducer: {
    bag: bagReducer,
    auth : authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;