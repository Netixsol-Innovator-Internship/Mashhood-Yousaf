// utils/auth.js
const API_BASE_URL = "http://localhost:4000/auth";

export const authService = {
  async signup(email, password) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  saveAuthData(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getAuthData() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  },

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};
