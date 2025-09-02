import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "./authSlice";

// create one global store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
