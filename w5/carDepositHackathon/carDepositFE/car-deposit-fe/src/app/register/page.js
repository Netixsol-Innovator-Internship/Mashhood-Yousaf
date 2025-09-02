"use client";
import { useState } from "react";
import AuctionText from "../../components/AuctionText";
import { useRegisterMutation } from "../../store/apiSlice"; // adjust path
import Link from "next/link";

export default function Register() {
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For checkbox inputs
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // For text inputs
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      // Sync fullName and username
      if (name === "fullName") {
        updatedData.username = value;
      } else if (name === "username") {
        updatedData.fullName = value;
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("You must agree to the terms and conditions before registering.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const result = await register(payload).unwrap();
      console.log("Registered ✅", result);
    } catch (err) {
      console.log("Register Failed ❌", err);
    }
  };

  return (
    <>
      {/* Keep Auction Section */}
      <AuctionText
        title="Register"
        description="Do you already have an account? Login Here"
        breadcrumbText="Register"
      />

      <div className="min-h-screen bg-white px-4 py-8">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="max-w-[500px] mx-auto mt-8 bg-white shadow-lg p-8"
        >
          <div className="text-center">
            <h3 className="text-[rgba(46,61,131,1)] font-bold">Register</h3>
            <p className="text-[rgba(175,175,175,1)] my-3 ">
              Do you already have an account?{" "}
              <Link href="/login" >
              <span className="text-[rgba(46,61,131,1)] font-semibold ">
                Login Here
              </span>
              </Link>
            </p>
          </div>

          {/* Personal Info */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-blue-900 mb-1">
              Personal Information
            </h2>
            <span className="block w-20 h-1 bg-yellow-400 rounded"></span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="fullName"
              placeholder="Enter Your Full Name*"
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="mobile"
              placeholder="Enter Mobile Number*"
              className="border border-gray-300 rounded-md p-2 w-full text-sm"
              value={formData.mobile}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email*"
              className="border border-gray-300 rounded-md p-2 w-full md:col-span-2 text-sm"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Account Info */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-blue-900 mb-1">
              Account Information
            </h2>
            <span className="block w-20 h-1 bg-yellow-400 rounded"></span>
          </div>
          <div className="mb-4">
            <div className="relative w-full mb-4">
              <input
                type="text"
                name="username"
                placeholder="Username*"
                className="border border-gray-300 rounded-md p-2 w-full text-sm pr-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.username}
                onChange={handleChange}
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-700 font-medium hover:underline"
              >
                Check Availability
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password*"
                className="border border-gray-300 rounded-md p-2 w-full text-sm"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password*"
                className="border border-gray-300 rounded-md p-2 w-full text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">
              I agree to the Terms & Conditions
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 rounded-md transition"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </>
  );
}
