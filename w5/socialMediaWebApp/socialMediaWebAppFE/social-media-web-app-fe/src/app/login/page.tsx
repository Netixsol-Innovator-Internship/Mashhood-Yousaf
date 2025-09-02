"use client";
import { useState } from "react";
import API from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.access_token;
      setToken(token);
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("authChange"));
      router.push("/profile");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        className="border p-2 w-full mb-2"
        data-placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        data-placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white w-full py-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
