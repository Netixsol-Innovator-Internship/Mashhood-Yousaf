"use client";
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0, id: null },
  reducers: {
    increment: (state, action) => {
      state.value += 1;
      state.id = action.payload;
    },
    decrement: (state, action) => {
      if (state.value > 0) {
        state.value -= 1;
      }
      state.id = action.payload;
    },
    reset: (state, action) => {
      state.value = 0;
      state.id = action.payload;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
