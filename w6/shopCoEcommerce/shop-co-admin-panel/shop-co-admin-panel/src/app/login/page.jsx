'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/api/shopCoApi";
// import { useLoginMutation } from "../api/shopCoApi";

export default function Login() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form).unwrap();
      localStorage.setItem("token", res.accessToken);
      router.push("/admin/dashboard");
      console.log("Login Success:", res);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-pink-500">
      <div className="max-w-md mx-auto mt-10 p-8 bg-white bg-opacity-70 backdrop-blur-xl rounded-lg shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6 text-shadow-md">
          Admin Login
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 text-white font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-500 to-pink-500  duration-300 transform ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            }`}
          >
            {isLoading ? (
              <span className="animate-pulse ">Logging in...</span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        {error && <p className="mt-3 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );

}
