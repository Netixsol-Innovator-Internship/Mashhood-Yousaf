// pages/auth/error.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthError() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");

    // Redirect to login with error message
    router.push(
      `/login?error=${encodeURIComponent(message || "Authentication failed")}`
    );
  }, [router]);

  return <div>Authentication failed. Redirecting...</div>;
}
