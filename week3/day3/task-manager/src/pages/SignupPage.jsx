import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const SignupPage = () => {
  const [state, setState] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleValue = (e) => {
    setState((s) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name = "", email = "", password = "" } = state;
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All Fields are required!");
      return;
    }

    if (password.length < 6) {
      return setError("Password length should be  greater than  5");
    }

    if (name.length < 4) {
      return setError("name length should be greater than 3");
    }

    if (!isValidEmail(email)) {
      return setError("Email Format isn't correct");
    }
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://day1-back-end.vercel.app/api/users/register",
        {
          name,
          email,
          password,
        }
      );

      // console.log("response", response);
      // Handle success
      // console.log("Sign up successful:", response.data);
      // setError("");
    } catch (error) {
      // console.log("Full error:", error.response.data)
      // console.log(" status code", error.response.data.status)
      setError(error.response.data.message);
    } finally {
      setLoading(false);
      alert('User Created')
      navigate('/login')
    }

    // console.log("name, email, password", name, email, password);
    // commenting setError line here because it's overwriting the previous errors
    // setError("");
  };
 if (loading) {
    return <Loader />;
 }
  // console.log("state", state);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <input
            onChange={handleValue}
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            onChange={handleValue}
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            onChange={handleValue}
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
