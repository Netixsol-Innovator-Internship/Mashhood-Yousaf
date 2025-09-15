"use client";
import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/store/shopCoApi";
import GuestRoute from "@/components/GuestRoute";

const RegisterPageContent = () => {
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

  // ✅ Social signup/login (same as login page)
  const handleSocialLogin = (provider) => {
    let authUrl = "";
    // const backendBaseUrl = "http://localhost:8000"; // update for prod
    const backendBaseUrl = "https://shop-co.up.railway.app"; // update for prod

    if (provider === "google") {
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=401722037920-pvpb77879ckhem9bj0edc7roaeobo1fl.apps.googleusercontent.com&redirect_uri=${backendBaseUrl}/auth/google/callback&response_type=code&scope=openid%20email%20profile`;
    } else if (provider === "github") {
      authUrl = `https://github.com/login/oauth/authorize?client_id=Ov23liAg806tTu7AYuz4&redirect_uri=${backendBaseUrl}/auth/github/callback&scope=user:email%20read:user`;
    } else if (provider === "discord") {
      authUrl = `https://discord.com/api/oauth2/authorize?client_id=1416000478172549221&redirect_uri=${backendBaseUrl}/auth/discord/callback&response_type=code&scope=identify%20email`;
    }

    window.location.href = authUrl;
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

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social SignUp/Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <img src="/icons8-google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="w-full py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <img src="/icons8-github.svg" alt="GitHub" className="w-5 h-5" />
              Continue with GitHub
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("discord")}
              className="w-full py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <img
                src="/icons8-discord.svg"
                alt="Discord"
                className="w-5 h-5"
              />
              Continue with Discord
            </button>
          </div>
        </form>
      </div>
    </GuestRoute>
  );
};


export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}