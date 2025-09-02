import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            TaskManager
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/addTask" className="text-gray-700 hover:text-blue-600">
              Add Task
            </Link>
            <Link to="/ " className="text-gray-700 hover:text-blue-600">
              Stats
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-2 mt-2 pb-4 border-t pt-4">
            <Link to="/dashboard" className="text-gray-700 px-2">
              Dashboard
            </Link>
            <Link to="/addTask" className="text-gray-700 px-2">
              Add Task
            </Link>
            <Link to="/ " className="text-gray-700 px-2">
              Stats
            </Link>
            <Link to="/login" className="text-gray-700 px-2">
              Login
            </Link>
            <Link to="/signup" className="text-gray-700 px-2">
              Signup
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
