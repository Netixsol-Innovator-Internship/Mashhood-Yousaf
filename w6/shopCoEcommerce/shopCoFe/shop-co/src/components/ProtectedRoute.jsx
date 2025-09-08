"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo); // redirect to login if not logged in
    }
  }, [isAuthenticated, router, redirectTo]);

  if (!isAuthenticated) return null; // or a loading spinner

  return children;
}
