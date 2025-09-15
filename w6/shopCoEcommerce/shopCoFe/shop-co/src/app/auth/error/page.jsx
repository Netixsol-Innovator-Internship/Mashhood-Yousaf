// app/auth/error/page.jsx
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");

    // Redirect to login with error message after a short delay
    const timer = setTimeout(() => {
      router.push(
        `/login?error=${encodeURIComponent(message || "Authentication failed")}`
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-500">
        <h2 className="text-xl font-semibold">Authentication Failed</h2>
        <p>Redirecting to login page...</p>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}