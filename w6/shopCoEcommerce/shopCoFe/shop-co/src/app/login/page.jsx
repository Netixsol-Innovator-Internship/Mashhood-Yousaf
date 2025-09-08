"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/shopCoApi";
import { setCredentials } from "@/store/authSlice";
import GuestRoute from "@/components/GuestRoute";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData).unwrap();
      dispatch(setCredentials(data));
      router.push("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <GuestRoute redirectTo="/">
      <div className="min-h-screen flex items-center justify-center bg-[rgba(240,238,237,1)] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">Invalid credentials</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg text-white"
            style={{ backgroundColor: "rgba(0,0,0,1)" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </GuestRoute>
  );
};

export default LoginPage;
