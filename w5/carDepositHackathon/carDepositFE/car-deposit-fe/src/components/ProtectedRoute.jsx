"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { access_token } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!access_token) {
      // agar login nahi hai to login page pe bhejo
      router.push(`/login?redirect=${pathname}`);
    }
  }, [access_token, router]);

  // jab tak check ho raha hai blank return kar do
  if (!access_token) {
    return <p className="text-center mt-10">Redirecting...</p>;
  }

  return children;
}
