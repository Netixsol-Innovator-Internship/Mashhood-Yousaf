// pages/auth/success.js
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/store/authSlice";

export default function AuthSuccess() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Get tokens from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken && refreshToken) {
      // Store tokens and redirect to home
      dispatch(setCredentials({ accessToken, refreshToken }));
      router.push("/");
    } else {
      router.push("/login?error=Authentication failed");
    }
  }, [dispatch, router]);

  return <div>Completing authentication...</div>;
}
