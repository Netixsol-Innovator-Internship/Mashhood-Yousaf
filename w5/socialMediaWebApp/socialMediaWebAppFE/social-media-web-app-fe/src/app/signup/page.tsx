"use client";
import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await API.post("/auth/register", {
        email,
        username,
        password,
      });
      alert("Signup successful! Login now.");
      router.push("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Signup</h1>
      <input
        className="border p-2 w-full mb-2"
        data-placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
        className="bg-green-600 text-white w-full py-2 rounded"
        onClick={handleSignup}
      >
        Signup
      </button>
    </div>  
  );
}
