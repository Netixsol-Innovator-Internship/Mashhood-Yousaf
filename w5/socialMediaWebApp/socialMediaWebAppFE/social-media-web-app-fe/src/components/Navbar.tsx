"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/lib/auth";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check auth status on initial load
    const checkAuth = () => {
      const token = getToken(); // Use your auth function or localStorage directly
      setIsAuth(!!token);
    };

    checkAuth();

    // Create a custom event listener for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    // Listen for custom auth events and storage changes
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Enhanced logout function that triggers auth state update
  const handleLogout = () => {
    logout();
    setIsAuth(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-900 text-white">
      <Link href="/" className="font-bold">
        Commenting...
      </Link>
      <div className="flex gap-4">
        {!isAuth ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        ) : (
          <>
            <Link href="/profile">Profile</Link>
            <Link href="/comments">Comments</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
