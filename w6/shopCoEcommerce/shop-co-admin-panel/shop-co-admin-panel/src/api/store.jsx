import { configureStore } from "@reduxjs/toolkit";
import { shopCoApi } from "./shopCoApi";

// configure store
export const store = configureStore({
  reducer: {
    // RTK Query API reducer
    [shopCoApi.reducerPath]: shopCoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopCoApi.middleware),
});
