"use client";
import React from "react";
import { useGetProfileQuery } from "@/store/shopCoApi";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProfilePage = () => {
  const { data, isLoading, error } = useGetProfileQuery();

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;

  if (error) {
    // Try to extract message from known backend structure
    const errorMessage =
      error?.data?.message || error?.error || "Something went wrong";

    return (
      <div className="max-w-3xl mx-auto mt-10 px-4 py-6 bg-red-100 text-red-700 rounded-lg border border-red-300">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{errorMessage}</p>
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    role,
    loyaltyPoints,
    addresses = [],
    isActive,
    provider,
    avatar
  } = data || {};

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <p>
            <span className="font-semibold">Name:</span> {name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {phone}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {role}
          </p>
          <p>
            <span className="font-semibold">Loyalty Points:</span>{" "}
            {loyaltyPoints}
          </p>
          <p>
            <span className="font-semibold">Provider:</span> {provider}
          </p>
          <p>
            <span className="font-semibold">Active:</span>{" "}
            {isActive ? "Yes" : "No"}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-semibold">Image:</span>
            <img
              src={avatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border"
            />
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Addresses</h2>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`p-4 rounded border ${
                address.isDefault
                  ? "border-black bg-gray-100"
                  : "border-gray-300"
              }`}
            >
              <p>
                <span className="font-semibold">Label:</span> {address.name}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {address.address}
              </p>
              <p>
                <span className="font-semibold">City:</span> {address.city}
              </p>
              <p>
                <span className="font-semibold">State:</span> {address.state}
              </p>
              <p>
                <span className="font-semibold">Zip Code:</span>{" "}
                {address.zipCode}
              </p>
              <p>
                <span className="font-semibold">Country:</span>{" "}
                {address.country || "N/A"}
              </p>
              <p className="mt-2">
                {address.isDefault ? (
                  <span className="text-green-600 font-semibold">
                    Default Address
                  </span>
                ) : (
                  <span className="text-gray-500">Secondary</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
