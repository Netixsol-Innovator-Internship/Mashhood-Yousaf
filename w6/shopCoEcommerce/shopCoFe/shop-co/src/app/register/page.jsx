"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/store/shopCoApi";
import GuestRoute from "@/components/GuestRoute";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const router = useRouter();
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      router.push("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <GuestRoute redirectTo="/">
      <div className="min-h-screen flex items-center justify-center bg-[rgba(240,238,237,1)] px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

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
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">Something went wrong</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg text-white"
            style={{ backgroundColor: "rgba(0,0,0,1)" }}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </GuestRoute>
  );
};

export default RegisterPage;
