"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

export default function ViewResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchResume = async () => {
      if (!user) return;

      try {
        const token = user?.token || localStorage.getItem("token");

        const response = await axios.get(`https://resume-builder-be.vercel.app/resume/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResume(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !resume) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Resume Not Found
            </h1>
            <p className="text-gray-600 mt-2">
              {error || "The resume you are looking for does not exist."}
            </p>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-500 mt-4 inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Resume Preview</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-gray-100 flex justify-center p-6">
            <div
              className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden w-full"
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "20mm",
                fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {/* Header */}
              <div className="bg-[#2c3e50] text-white text-center py-6 rounded-md mb-6">
                <h1 className="text-3xl font-bold mb-1">{resume.fullName}</h1>
                {/* <p className="text-[#ecf0f1] text-sm">Professional Title</p> */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-[#3498db] mt-4">
                  {resume.email && (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-envelope" />
                      <span>{resume.email}</span>
                    </div>
                  )}
                  {resume.phone && (
                    <div className="flex items-center gap-2">
                      <i className="fas fa-phone" />
                      <span>{resume.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              {resume.education && (
                <section className="mb-6">
                  <h2 className="text-xl font-semibold text-[#3498db] border-b border-[#3498db] pb-1 mb-3 flex items-center gap-2">
                    <i className="fas fa-graduation-cap" />
                    Education
                  </h2>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {resume.education}
                  </p>
                </section>
              )}

              {/* Skills */}
              {resume.skills?.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-xl font-semibold text-[#3498db] border-b border-[#3498db] pb-1 mb-3 flex items-center gap-2">
                    <i className="fas fa-star" />
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-[#3498db] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Experience */}
              {resume.experience && (
                <section>
                  <h2 className="text-xl font-semibold text-[#3498db] border-b border-[#3498db] pb-1 mb-3 flex items-center gap-2">
                    <i className="fas fa-briefcase" />
                    Experience
                  </h2>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {resume.experience}
                  </p>
                </section>
              )}

              {/* Download Buttons */}
              <footer className="mt-10 pt-6 border-t border-gray-200 flex justify-center gap-4">
                <button
                  onClick={() => handleDownload("pdf")}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  <i className="fas fa-file-pdf mr-2" />
                  Download PDF
                </button>

                <button
                  onClick={() => handleDownload("docx")}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  <i className="fas fa-file-word mr-2" />
                  Download DOCX
                </button>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
