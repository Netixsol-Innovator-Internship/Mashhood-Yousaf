'use client'
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { submissionAPI } from "../utils/api";

export default function TestUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const assignmentId = "68dfaf1e6b1a7c9d16852d47";

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please select a PDF file");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("assignmentId", assignmentId);

    try {
      const response = await submissionAPI.upload(formData);
      setMessage(
        `✅ Upload successful! Uploaded ${response.data.length} file(s)`
      );
      setSelectedFile(null);

      // Load submissions to verify
      loadSubmissions();
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(
        `❌ Upload failed: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  const loadSubmissions = async () => {
    try {
      const response = await submissionAPI.getByAssignment(assignmentId);
      setSubmissions(response.data);
      console.log("Submissions:", response.data);
    } catch (error) {
      console.error("Error loading submissions:", error);
    }
  };

  const handleEvaluate = async () => {
    try {
      setMessage("Evaluating...");
      const response = await submissionAPI.evaluate(assignmentId);
      setMessage(
        `✅ Evaluation completed! Processed ${response.data.length} submission(s)`
      );
      loadSubmissions();
    } catch (error) {
      setMessage(
        `❌ Evaluation failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Test File Upload</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Upload PDF File</h2>
          <p className="text-gray-600 mb-4">
            Assignment ID:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              {assignmentId}
            </code>
          </p>

          {message && (
            <div
              className={`p-4 mb-4 rounded ${
                message.includes("❌")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload PDF"}
              </button>

              <button
                type="button"
                onClick={loadSubmissions}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Load Submissions
              </button>

              <button
                type="button"
                onClick={handleEvaluate}
                disabled={submissions.length === 0}
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                Evaluate with AI
              </button>
            </div>
          </form>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Submissions for Assignment</h2>

          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No submissions found
            </p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <div
                  key={submission._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-bold text-lg">Submission {index + 1}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <strong>Student:</strong> {submission.studentName}
                    </div>
                    <div>
                      <strong>Roll Number:</strong> {submission.rollNumber}
                    </div>
                    <div>
                      <strong>Filename:</strong> {submission.filename}
                    </div>
                    <div>
                      <strong>Word Count:</strong> {submission.wordCount}
                    </div>
                    <div>
                      <strong>Score:</strong>
                      {submission.score > 0 ? (
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded">
                          {submission.score}/100
                        </span>
                      ) : (
                        <span className="ml-2 text-gray-500">
                          Not evaluated
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Remarks:</strong>{" "}
                      {submission.remarks || "Not evaluated"}
                    </div>
                  </div>
                  {submission.extractedText && (
                    <div className="mt-3">
                      <strong>Extracted Text Preview:</strong>
                      <p className="text-sm text-gray-600 mt-1 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                        {submission.extractedText.substring(0, 500)}...
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
