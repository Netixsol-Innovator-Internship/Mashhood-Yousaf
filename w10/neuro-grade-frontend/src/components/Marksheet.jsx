import React, { useState } from "react";
import { submissionAPI } from "../app/utils/api";

const Marksheet = ({ assignments }) => {
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const handleGenerateMarksheet = async () => {
    if (!selectedAssignment) {
      setMessage("❌ Please select an assignment first");
      return;
    }

    setGenerating(true);
    setMessage("🔄 Fetching evaluated submissions...");

    try {
      const response = await submissionAPI.getByAssignment(selectedAssignment);
      const assignmentSubmissions = response.data || [];

      if (assignmentSubmissions.length === 0) {
        setMessage("❌ No submissions found for this assignment.");
        setGenerating(false);
        return;
      }

      const evaluatedSubmissions = assignmentSubmissions.filter(
        (sub) => sub.score > 0
      );

      if (evaluatedSubmissions.length === 0) {
        setMessage("❌ No evaluated submissions found.");
        setGenerating(false);
        return;
      }

      setSubmissions(evaluatedSubmissions);
      setMessage(
        `✅ Found ${evaluatedSubmissions.length} evaluated submission(s). Click download to generate CSV.`
      );
    } catch (error) {
      setMessage(
        `❌ Failed to fetch submissions: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setGenerating(false);
    }
  };

  const generateCSV = () => {
    if (submissions.length === 0) return null;
    const headers = [
      "Student Info",
      "Score",
      "Word Count",
      "Remarks",
      "Status",
    ];
    const rows = submissions.map((submission) => [
      // `"${submission.filename || "N/A"}"`,
      `"${
        submission.filename
          ? submission.filename.replace(/^\d+-\d+-/, "").replace(/\.pdf$/i, "")
          : "N/A"
      }"`,
      submission.score || 0,
      submission.wordCount || 0,
      `"${(submission.remarks || "Not evaluated").replace(/"/g, '""')}"`,
      submission.score > 0 ? "Evaluated" : "Pending",
    ]);
    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

  const handleDownloadCSV = () => {
    if (submissions.length === 0) return;
    const csvContent = generateCSV();
    if (!csvContent) return;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const assignment = assignments.find((a) => a._id === selectedAssignment);
    const filename = `marksheet-${
      assignment?.title || selectedAssignment
    }-${new Date().getTime()}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.click();
    setMessage(`✅ CSV marksheet downloaded: ${filename}`);
  };

  const getStats = () => {
    const total = submissions.length;
    const averageScore =
      total > 0
        ? (
            submissions.reduce((sum, sub) => sum + sub.score, 0) / total
          ).toFixed(2)
        : 0;
    const maxScore =
      total > 0 ? Math.max(...submissions.map((s) => s.score)) : 0;
    const minScore =
      total > 0 ? Math.min(...submissions.map((s) => s.score)) : 0;
    return { total, averageScore, maxScore, minScore };
  };

  const stats = getStats();

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Download Marksheet</h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md text-sm ${
            message.includes("❌")
              ? "bg-red-800 text-red-200 border border-red-600"
              : message.includes("✅")
              ? "bg-green-800 text-green-200 border border-green-600"
              : "bg-blue-800 text-blue-200 border border-blue-600"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Assignment Select */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Assignment *
          </label>
          <select
            value={selectedAssignment}
            onChange={(e) => {
              setSelectedAssignment(e.target.value);
              setSubmissions([]);
              setMessage("");
            }}
            className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose an assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title} - {assignment.teacherName}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleGenerateMarksheet}
            disabled={generating || !selectedAssignment}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-200"
          >
            {generating ? "Loading..." : "1. Load Evaluated Data"}
          </button>

          {submissions.length > 0 && (
            <button
              onClick={handleDownloadCSV}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
            >
              Download CSV
            </button>
          )}
        </div>

        {/* Stats */}
        {submissions.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-md text-center border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                {stats.total}
              </div>
              <div className="text-sm text-gray-400">Submissions</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-md text-center border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">
                {stats.averageScore}
              </div>
              <div className="text-sm text-gray-400">Avg Score</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-md text-center border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">
                {stats.maxScore}
              </div>
              <div className="text-sm text-gray-400">Max Score</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-md text-center border border-gray-700">
              <div className="text-2xl font-bold text-red-400">
                {stats.minScore}
              </div>
              <div className="text-sm text-gray-400">Min Score</div>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {submissions.length > 0 && (
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <h3 className="font-bold text-gray-200 p-4 bg-gray-800 border-b border-gray-700">
              Marksheet Preview ({submissions.length} submissions)
            </h3>
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    {["Student Info", "Score", "Words", "Remarks"].map(
                      (head) => (
                        <th
                          key={head}
                          className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase"
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {submissions.map((submission, index) => (
                    <tr key={submission._id}>
                      <td className="px-4 py-2 text-sm text-gray-200">
                        {submission.filename
                          ? submission.filename
                              .replace(/^\d+-\d+-/, "")
                              .replace(/\.pdf$/i, "")
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            submission.score >= 80
                              ? "bg-green-900 text-green-300"
                              : submission.score >= 60
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {submission.score}/100
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-400">
                        {submission.wordCount}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 max-w-xs truncate">
                        {submission.remarks || "No remarks"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
          <h3 className="font-medium text-yellow-400 mb-2">Instructions:</h3>
          <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
            <li>Select an assignment with evaluated submissions</li>
            <li>Click "Load Evaluated Data" to fetch submission data</li>
            <li>Download as CSV for further use</li>
            <li>
              File includes: Student names, roll numbers, scores, remarks,
              evaluation details
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Marksheet;
