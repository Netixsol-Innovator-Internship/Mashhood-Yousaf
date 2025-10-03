"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import FileUpload from "../../components/FileUpload";
import SubmissionList from "../../components/SubmissionList";
import { assignmentAPI, submissionAPI } from "../utils/api";

export default function Submissions() {
  const [assignments, setAssignments] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setError("");
      setLoading(true);
      const assignmentsRes = await assignmentAPI.getAll();
      setAssignments(assignmentsRes.data || []);

      if (assignmentsRes.data && assignmentsRes.data.length > 0) {
        await fetchAllSubmissions(assignmentsRes.data);
      } else {
        setAllSubmissions([]);
      }
    } catch (error) {
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubmissions = async (assignmentsList) => {
    let submissions = [];
    for (const assignment of assignmentsList) {
      try {
        const submissionsRes = await submissionAPI.getByAssignment(
          assignment._id
        );
        if (submissionsRes.data?.length > 0) {
          submissions = [...submissions, ...submissionsRes.data];
        }
      } catch (subError) {
        console.warn("Error fetching submissions:", subError.message);
      }
    }
    setAllSubmissions(submissions);
  };

  const handleUploadComplete = async (newSubmissions) => {
    setAllSubmissions((prev) => [...newSubmissions, ...prev]);
    setTimeout(() => fetchAllData(), 2000);
  };

  const handleEvaluationComplete = (evaluatedSubmissions) => {
    const updatedSubmissions = allSubmissions.map((sub) => {
      const evaluated = evaluatedSubmissions.find((es) => es._id === sub._id);
      return evaluated || sub;
    });
    setAllSubmissions(updatedSubmissions);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-300">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading data...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 text-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Submission Management
          </h1>
          <p className="text-gray-400">
            Upload student submissions and evaluate them with AI
          </p>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {assignments.length === 0 ? (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded">
            <strong>No assignments found.</strong> Please create one first.
            <div className="mt-2">
              <a
                href="/assignments"
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-200"
              >
                Create Assignment
              </a>
            </div>
          </div>
        ) : (
          <>
            <FileUpload
              assignments={assignments}
              onUploadComplete={handleUploadComplete}
            />

            <SubmissionList
              assignments={assignments}
              submissions={allSubmissions}
              onEvaluationComplete={handleEvaluationComplete}
              onRefresh={fetchAllData}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
