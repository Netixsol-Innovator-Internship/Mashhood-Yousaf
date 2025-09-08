'use client'
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-[#FAFAFA] flex justify-between items-center px-6 shadow-sm">
      <h1 className="font-bold text-xl">Admin Dashboard</h1>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
}
