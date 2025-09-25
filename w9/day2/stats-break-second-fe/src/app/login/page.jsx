'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
     e.preventDefault(); 
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      console.log('setting token')
      router.push('/');
    } catch (err) {
      setError('Something went wrong');
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gray-900 text-gray-200 font-sans">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/cricket-stadium.jpg')" }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

      {/* Login Form Card */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl animate-fadeIn">
        <div className="text-center">
          <img
            src="/cricket-helmet-svgrepo-com.svg"
            alt="Cricket Logo"
            className="w-16 h-16 mx-auto mb-4 opacity-80"
          />
          <h1 className="text-3xl font-bold text-green-400">Welcome Back!</h1>
          <p className="mt-2 text-gray-400">
            Log in to access your cricket knowledge base.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-white placeholder-gray-500 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white placeholder-gray-500 bg-gray-800 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-400 animate-pulse">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-400">
          Don't have an account yet?{" "}
          <Link
            href="/signup"
            className="font-medium text-green-400 hover:text-green-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
