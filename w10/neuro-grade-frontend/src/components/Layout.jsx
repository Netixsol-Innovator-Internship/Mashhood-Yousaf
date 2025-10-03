// Layout.js
import React from "react";
import { LayoutDashboard, BookOpen, FileText } from "lucide-react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-gray-100 shadow-lg sticky top-0 z-50 border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                N
              </span>
              NeuroGrade
            </h1>

            <nav className="flex space-x-8 text-sm font-medium">
              <a
                href="/"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200"
              >
                <LayoutDashboard size={18} /> Dashboard
              </a>
              <a
                href="/assignments"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200"
              >
                <BookOpen size={18} /> Assignments
              </a>
              <a
                href="/submissions"
                className="flex items-center gap-2 hover:text-blue-400 transition duration-200"
              >
                <FileText size={18} /> Submissions
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">{children}</main>
    </div>
  );
};

export default Layout;
