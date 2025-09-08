"use client";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsAllowed(window.innerWidth >= 1024); // laptop aur above allowed
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isAllowed) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center p-5">
        <p className="text-lg font-semibold">
          🚫 Admin panel is only accessible on laptop or larger screens. Please
          use a bigger device.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
