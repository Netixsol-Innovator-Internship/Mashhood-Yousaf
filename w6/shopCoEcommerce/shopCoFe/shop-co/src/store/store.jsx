// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { shopCoApi } from "./shopCoApi";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    [shopCoApi.reducerPath]: shopCoApi.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(shopCoApi.middleware),
});
