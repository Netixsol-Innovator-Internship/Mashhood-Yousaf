import React, { useState } from "react";
import { submissionAPI } from "../app/utils/api";

const SubmissionList = ({ assignments, submissions, onEvaluationComplete }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(
    assignments[0]?._id || ""
  );
  const [evaluating, setEvaluating] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const handleAssignmentChange = async (assignmentId) => {
    setSelectedAssignment(assignmentId);
    if (!assignmentId) return;

    setLoadingSubmissions(true);
    try {
      const response = await submissionAPI.getByAssignment(assignmentId);
      console.log("Submissions for assignment:", response.data);
    } catch (error) {
      console.error("Error loading submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleEvaluate = async () => {
    if (!selectedAssignment) {
      setMessage("Please select an assignment first");
      return;
    }

    setEvaluating(true);
    setMessage("");

    try {
      const response = await submissionAPI.evaluate(selectedAssignment);
      setMessage(
        `✅ Evaluation completed! Processed ${response.data.length} submission(s)`
      );

      if (onEvaluationComplete) {
        onEvaluationComplete(response.data);
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      setMessage(
        "❌ Error evaluating submissions: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setEvaluating(false);
    }
  };

  const filteredSubmissions = selectedAssignment
    ? submissions.filter((sub) => sub.assignmentId === selectedAssignment)
    : submissions;

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-800 text-green-100";
    if (score >= 60) return "bg-yellow-800 text-yellow-100";
    return "bg-red-800 text-red-100";
  };

  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Student Submissions</h2>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <select
            value={selectedAssignment}
            onChange={(e) => handleAssignmentChange(e.target.value)}
            className="px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment._id} value={assignment._id}>
                {assignment.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleEvaluate}
            disabled={
              evaluating ||
              !selectedAssignment ||
              filteredSubmissions.length === 0
            }
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition duration-200"
          >
            {evaluating
              ? "Evaluating..."
              : `Evaluate (${filteredSubmissions.length})`}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${
            message.includes("❌")
              ? "bg-red-800 text-red-100"
              : "bg-green-800 text-green-100"
          }`}
        >
          {message}
        </div>
      )}

      {loadingSubmissions ? (
        <div className="text-center py-8 text-gray-400">
          Loading submissions...
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {selectedAssignment
            ? "No submissions found for selected assignment"
            : "Please select an assignment to view submissions"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Student Info
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Roll Number
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Words
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {filteredSubmissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">
                    {submission.filename
                      ?.replace(/^\d+-\d+-/, "")
                      .replace(/\.pdf$/i, "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {submission.wordCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {submission.score > 0 ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                          submission.score
                        )}`}
                      >
                        {submission.score}/100
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        Not evaluated
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                    {submission.remarks || "Not evaluated"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {submission.score > 0 ? (
                      <span className="text-green-400">Evaluated</span>
                    ) : (
                      <span className="text-yellow-400">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
