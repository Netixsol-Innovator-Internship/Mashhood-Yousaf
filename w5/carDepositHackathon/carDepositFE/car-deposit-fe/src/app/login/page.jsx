"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice"; // ✅ correct import
import { useLoginMutation } from "../../store/apiSlice"; // ✅ apni RTK query se import
import { useRouter, useSearchParams } from "next/navigation";

import AuctionText from "../../components/AuctionText";
import Link from "next/link";

export default function Login() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  // console.log('login', login)
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/"; // default home

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in both fields");
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const result = await login(payload).unwrap();
      dispatch(setCredentials(result));
      router.push(redirectPath);
      console.log("Login Successful ✅", result);
    } catch (err) {
      console.error("Login Failed ❌", err);
    }
  };

  return (
    <>
      <AuctionText
        title="Login"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbText="Login"
      />
      <div className="min-h-screen bg-white px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-[500px] mx-auto mt-8 bg-white shadow-lg p-8"
        >
          {/* Title */}
          <div className="text-center">
            <h3 className="text-[rgba(46,61,131,1)] font-bold">Login</h3>
            <p className="text-[rgba(175,175,175,1)] my-3 ">
              New Member?{" "}
              <Link href="/register">
                <span className="text-[rgba(46,61,131,1)] font-semibold ">
                  Register Here
                </span>
              </Link>
            </p>
          </div>

          {/* Login Info */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-blue-900 mb-1">
              Account Information
            </h2>
            <span className="block w-20 h-1 bg-yellow-400 rounded"></span>
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email*"
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password*"
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}
