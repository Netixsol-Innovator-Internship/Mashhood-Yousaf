"use client";
import { useState, useEffect } from "react";
import API from "../utils/axios";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const router = useRouter();

  // Check system preference for dark mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark =
        localStorage.getItem("darkMode") === "true" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(isDark);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Check password strength
  useEffect(() => {
    const strength = {
      hasMinLength: form.password.length >= 8,
      hasUpperCase: /[A-Z]/.test(form.password),
      hasLowerCase: /[a-z]/.test(form.password),
      hasNumber: /[0-9]/.test(form.password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    };
    setPasswordStrength(strength);
  }, [form.password]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    const passwordScore =
      Object.values(passwordStrength).filter(Boolean).length;
    if (passwordScore < 3) {
      setError(
        "Password is too weak. Please include uppercase, lowercase, numbers, and special characters."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await API.post("/auth/signup", {
        email: form.email,
        password: form.password,
      });
      router.push("/login?message=signup_success");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const passwordScore = Object.values(passwordStrength).filter(Boolean).length;
  const getPasswordStrengthColor = () => {
    if (passwordScore === 0) return "bg-gray-300";
    if (passwordScore <= 2) return "bg-red-500";
    if (passwordScore <= 3) return "bg-yellow-500";
    if (passwordScore <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordScore === 0) return "Very Weak";
    if (passwordScore <= 2) return "Weak";
    if (passwordScore <= 3) return "Fair";
    if (passwordScore <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">

      {/* Dark Mode Toggle */}
      {/* <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <span className="text-yellow-400 text-lg">☀️</span>
        ) : (
          <span className="text-gray-700 text-lg">🌙</span>
        )}
      </button> */}

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Signup Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join us today and start your journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-sm text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {form.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Password Strength
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordScore <= 2
                            ? "text-red-500"
                            : passwordScore <= 3
                            ? "text-yellow-500"
                            : passwordScore <= 4
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordScore / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mt-3 space-y-1">
                  <PasswordRequirement
                    met={passwordStrength.hasMinLength}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasUpperCase}
                    text="One uppercase letter"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasLowerCase}
                    text="One lowercase letter"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasNumber}
                    text="One number"
                  />
                  <PasswordRequirement
                    met={passwordStrength.hasSpecialChar}
                    text="One special character"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {form.confirmPassword &&
                  form.password !== form.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Terms Hint */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Password Requirement Component
const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-400" />
    )}
    <span
      className={`text-xs ${
        met
          ? "text-green-600 dark:text-green-400"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {text}
    </span>
  </div>
);
