"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestRoute({ children, redirectTo = "/" }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo); // redirect if already logged in
    }
  }, [isAuthenticated, router, redirectTo]);

  if (isAuthenticated) return null;

  return children;
}
