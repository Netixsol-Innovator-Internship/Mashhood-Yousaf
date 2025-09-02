"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Car Auction", path: "/auctions" },
  { name: "Sell Your Car", path: "/sellCar" },
  { name: "Profile", path: "/profile" },
  { name: "Contact", path: "/"},
];

export default function BlueClrHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="  w-full z-50 bg-[rgba(232,237,250,1)] text-[rgba(46,61,131,1)] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/carLogo.svg" alt="logo" width={185} height={185} />
            {/* <span className="text-xl font-semibold">
              Car<span className="text-green-500">Deposit</span>
            </span> */}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path}>
                {item.name}
                {pathname === item.path && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400" />
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/login" className="hover:underline">
              <img src="/whishlist.svg" alt="" />
            </Link>
            <Link
              href="/register"
              className=" "
            >
              <img src="/bell.png" alt="" />
            </Link>
            <Link
              href="/register"
              className=" "
            >
              <img src="/car.svg" alt="" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 px-4 py-4 space-y-4">
          {navItems.map((item,i) => (
            <Link
              key={i}
              href={item.path}
              className="block text-white"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <Link href="/login" className="hover:underline">
              Sign in
            </Link>
            <span className="text-gray-400">or</span>
            <Link
              href="/register"
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-1.5 rounded transition"
            >
              Register now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
