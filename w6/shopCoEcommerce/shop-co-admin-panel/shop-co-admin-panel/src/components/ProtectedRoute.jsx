"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "../api/shopCoApi";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [shouldFetch, setShouldFetch] = useState(false);

  // Delay fetching until client-side is confirmed
  useEffect(() => {
    setShouldFetch(true);
  }, []);

  const {
    data: profile,
    isLoading,
    isError,
  } = useGetProfileQuery(undefined, {
    skip: !shouldFetch,
  });

  useEffect(() => {
    if (shouldFetch && !isLoading) {
      // Check if user is not authenticated or has an invalid role
      if (
        isError ||
        !profile ||
        (profile.role !== "admin" && profile.role !== "superadmin") // Changed to match backend enum
      ) {
        router.replace("/login");
      }
    }
  }, [shouldFetch, isLoading, isError, profile, router]);

  if (!shouldFetch || isLoading) return <div>Loading...</div>;

  // Only render children if the role is admin or superadmin
  return profile && (profile.role === "admin" || profile.role === "superadmin")
    ? children
    : null;
}
