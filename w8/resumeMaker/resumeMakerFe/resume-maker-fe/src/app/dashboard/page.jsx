"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('decoded', decoded)
        setEmail(decoded.email); // ✅ extract email from token
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    const fetchResumes = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");
        const response = await axios.get(
          "https://resume-builder-be.vercel.app/resume/my-resumes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResumes(response.data);
      } catch (error) {
        console.error("Failed to fetch resumes", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchResumes();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      await axios.delete(`https://resume-builder-be.vercel.app/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(resumes.filter((resume) => resume._id !== id));
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const handleDownload = async (type) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const response = await axios.get(
        `https://resume-builder-be.vercel.app/resume/${id}/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // important for file download
        }
      );

      // create file download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume.${type}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Resume Builder</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {email}</span>
                <button
                  onClick={logout}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">My Resumes</h2>
              <Link
                href="/resume/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Create New Resume
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  You haven't created any resumes yet.
                </p>
                <Link
                  href="/resume/create"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Create Your First Resume
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {resume.fullName}
                    </h3>
                    <p className="text-gray-600 mb-4">{resume.email}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/resume/${resume._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(resume._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDownload("pdf")}
                        className="bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-md font-medium"
                      >
                        Download PDF
                      </button>

                      <button
                        onClick={() => handleDownload("docx")}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-4 rounded-md font-medium"
                      >
                        Download DOCX
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
