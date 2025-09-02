'use client';
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counterSlice";

export const counterStore = configureStore({
  reducer:{
    counter : counterReducer,
  },
});