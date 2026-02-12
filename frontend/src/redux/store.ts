import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice"; // 👈 Ye import karo
import { authApi } from "../services/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    profile: profileReducer, // 👈 Ye line add karna zaroori hai
    [authApi.reducerPath]: authApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
