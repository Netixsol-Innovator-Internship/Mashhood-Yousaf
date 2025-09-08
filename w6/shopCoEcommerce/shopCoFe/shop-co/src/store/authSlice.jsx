// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setCredentials, logout, setLoading, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
