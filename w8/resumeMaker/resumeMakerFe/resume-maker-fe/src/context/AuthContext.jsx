"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Verify token with the backend
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: payload.id, email: payload.email });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("https://resume-builder-be.vercel.app/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: payload.id, email: payload.email });

      router.push("/dashboard");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post("https://resume-builder-be.vercel.app/auth/register", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: payload.id, email: payload.email });

      router.push("/dashboard");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/auth/login");
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
