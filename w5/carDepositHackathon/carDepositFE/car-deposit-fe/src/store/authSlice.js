import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, user } = action.payload;
      state.access_token = access_token;
      state.user = user;

      // localStorage me save karna
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.access_token = null;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
