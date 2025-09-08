"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Orders", path: "/admin/orders" },
    { name: "All Products", path: "/admin/products" },
    // { name: "Reviews", path: "/admin/reviews" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#FAFAFA] fixed">
      <div className="p-6 text-xl font-bold ">
        <img src="/logo.svg" alt="Logo" />
      </div>
      <nav className="mt-6 flex flex-col">
        {links.map((link) => (
          <Link key={link.path} href={link.path}>
            <div
              className={`px-6 py-3 cursor-pointer ${
                pathname === link.path
                  ? "bg-[#003F62] text-white"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              {link.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
