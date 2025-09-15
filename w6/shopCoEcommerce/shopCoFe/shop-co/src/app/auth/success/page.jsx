// app/auth/success/page.jsx
"use client";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setCredentials } from "@/store/authSlice";

export  function AuthSuccessComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get tokens from URL query parameters
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const user = searchParams.get("user");

    if (accessToken && refreshToken && user) {
      try {
        // Store tokens and redirect to home
        dispatch(
          setCredentials({
            accessToken,
            refreshToken,
            user: JSON.parse(user),
          })
        );
        router.push("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login?error=Authentication failed");
      }
    } else {
      router.push("/login?error=Authentication failed");
    }
  }, [dispatch, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p>Please wait while we complete your login.</p>
      </div>
    </div>
  );
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSuccessComponent />
    </Suspense>
  );
}