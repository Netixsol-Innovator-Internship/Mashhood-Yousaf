"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";

import {
  UserIcon,
  ShoppingCartIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import GuestRoute from "./GuestRoute";
import ClientOnly from "./ClientOnly";

const navLinks = [
  { name: "On Sale", href: "/" },
  { name: "New Arrivals", href: "/products?dressStyle=party" },
  { name: "Brands", href: "/products?dressStyle=formal" },
];

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { items } = useSelector((state) => state.cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // 👇 hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top Promo Bar */}
      <ClientOnly>
        <GuestRoute redirectTo="/">
          <div className="w-full bg-black text-white text-[11px] sm:text-sm py-2 text-center">
            Sign up and get 20% off your first order.{" "}
            <Link href="/register" className="underline font-medium">
              Sign Up Now
            </Link>
          </div>
        </GuestRoute>
      </ClientOnly>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center"
          >
            <span>SHOP.CO</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-black text-base font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 mx-8 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Icons & User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-black relative"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/profile"
              className="p-2 text-gray-700 hover:text-black"
            >
              <UserIcon className="h-6 w-6" />
            </Link>
            {/* Auth buttons */}
            {!isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Link href="/login">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm"
                    style={{ backgroundColor: "rgba(0,0,0,1)" }}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <button
                className="px-4 py-2 rounded-lg border text-sm"
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            )}
            {/* Mobile Menu button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Bars3Icon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-black text-base font-medium py-2"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2 mt-2">
              <Link href="/cart" className="p-2 text-gray-700 hover:text-black">
                <ShoppingCartIcon className="h-6 w-6" />
              </Link>
              <Link
                href="/profile"
                className="p-2 text-gray-700 hover:text-black"
              >
                <UserIcon className="h-6 w-6" />
              </Link>
            </div>
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2 mt-2">
                <Link href="/login">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm"
                    style={{ backgroundColor: "rgba(0,0,0,1)" }}
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <button
                className="px-4 py-2 rounded-lg border text-sm"
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
