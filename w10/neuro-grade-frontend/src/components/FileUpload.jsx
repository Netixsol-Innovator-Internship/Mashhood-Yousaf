import React, { useState } from "react";
import { submissionAPI } from "../app/utils/api";

const FileUpload = ({ assignments, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedAssignment) {
      setMessage("❌ Please select an assignment first");
      return;
    }

    if (selectedFiles.length === 0) {
      setMessage("❌ Please select at least one PDF file");
      return;
    }

    setLoading(true);
    setMessage("🔄 Uploading files...");

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("assignmentId", selectedAssignment);

    try {
      const response = await submissionAPI.upload(formData);
      setMessage(`✅ Successfully uploaded ${response.data.length} file(s)`);
      setSelectedFiles([]);

      if (onUploadComplete) {
        onUploadComplete(response.data);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Upload failed";
      setMessage(`❌ Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Upload Student Submissions
      </h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md text-sm ${
            message.includes("❌")
              ? "bg-red-800 text-red-200 border border-red-600"
              : "bg-green-800 text-green-200 border border-green-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-5">
        {/* Assignment Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Assignment *
          </label>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title} - {assignment.teacherName}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {assignments.length} assignment(s) available
          </p>
        </div>

        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select PDF Files *
          </label>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {selectedFiles.length > 0 && (
            <div className="mt-3 p-3 bg-gray-800 border border-gray-700 rounded-md">
              <p className="text-sm font-medium text-blue-400 mb-1">
                Selected files:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                {selectedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name}{" "}
                    <span className="text-gray-500">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={
            loading || !selectedAssignment || selectedFiles.length === 0
          }
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition duration-200"
        >
          {loading
            ? "📤 Uploading..."
            : `📁 Upload ${selectedFiles.length} File(s)`}
        </button>
      </form>

      {/* Debug Info */}
      <div className="mt-5 p-3 bg-gray-800 border border-gray-700 rounded-md">
        <p className="text-sm text-gray-400">
          <strong className="text-gray-300">Debug Info:</strong> Assignment ID:{" "}
          {selectedAssignment || "None selected"}
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
