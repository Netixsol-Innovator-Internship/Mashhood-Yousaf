"use client";

import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todoSlice";
import { postsApi } from "../services/postsApi"; // fixed path (avoid @/ alias if unsure)

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
});
