"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

export default function CreateResumePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    skills: "",
    experience: "",
    templateId: 1,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim());

      const response = await axios.post(
        "https://resume-builder-be.vercel.app/resume/create",
        {
          ...formData,
          skills: skillsArray,
        }
      );

      router.push(`/resume/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create resume");
    } finally {
      setLoading(false);
    }
  };

  // Function to render skills as list items
  const renderSkills = () => {
    if (!formData.skills) return null;
    return formData.skills.split(",").map((skill, index) => (
      <li key={index} className="mb-1">
        {skill.trim()}
      </li>
    ));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Resume</h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="education"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Education *
                    </label>
                    <textarea
                      id="education"
                      name="education"
                      rows={3}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.education}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skills"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Skills (comma-separated) *
                    </label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., JavaScript, React, Node.js"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Experience *
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      rows={6}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Describe your work experience, projects, achievements..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    >
                      {loading ? "Creating..." : "Create Resume"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#2c3e50] border-b pb-3 mb-4 flex items-center gap-2">
                  <i className="fas fa-eye text-[#3498db]" />
                  Resume Preview
                </h2>
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="resume-preview font-sans text-sm text-gray-800">
                    {/* Header */}
                    <div className="bg-[#2c3e50] text-white text-center py-6 rounded-md mb-6">
                      <h1 className="text-3xl font-bold mb-1">
                        {formData.fullName || "Your Name"}
                      </h1>
                      {/* <p className="text-[#ecf0f1] text-sm">
                        Professional Title
                      </p> */}
                      <div className="flex flex-wrap justify-center gap-6 text-sm text-[#3498db] mt-4">
                        {formData.email && (
                          <div className="flex items-center gap-2">
                            <i className="fas fa-envelope" />
                            <span>{formData.email}</span>
                          </div>
                        )}
                        {formData.phone && (
                          <div className="flex items-center gap-2">
                            <i className="fas fa-phone" />
                            <span>{formData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Education */}
                    {formData.education && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#3498db] border-b border-[#3498db] pb-1 mb-2 flex items-center gap-2">
                          <i className="fas fa-graduation-cap" />
                          Education
                        </h3>
                        <p className="whitespace-pre-line leading-relaxed text-gray-700">
                          {formData.education}
                        </p>
                      </div>
                    )}

                    {/* Skills */}
                    {formData.skills && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#3498db] border-b border-[#3498db] pb-1 mb-2 flex items-center gap-2">
                          <i className="fas fa-star" />
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.split(",").map((skill, index) => (
                            <span
                              key={index}
                              className="bg-[#3498db] text-white px-3 py-1 rounded-full text-sm"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {formData.experience && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-[#3498db] border-b border-[#3498db] pb-1 mb-2 flex items-center gap-2">
                          <i className="fas fa-briefcase" />
                          Experience
                        </h3>
                        <p className="whitespace-pre-line leading-relaxed text-gray-700">
                          {formData.experience}
                        </p>
                      </div>
                    )}

                    {/* Empty state */}
                    {!formData.fullName &&
                      !formData.email &&
                      !formData.phone &&
                      !formData.education &&
                      !formData.skills &&
                      !formData.experience && (
                        <div className="text-gray-400 text-center py-8">
                          Your resume preview will appear here as you fill out
                          the form.
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
