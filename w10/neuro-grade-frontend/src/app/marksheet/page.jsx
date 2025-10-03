"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Marksheet from "../../components/Marksheet";
import { assignmentAPI } from "../utils/api";

export default function MarksheetPage() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError("");

      const assignmentsRes = await assignmentAPI.getAll();
      setAssignments(assignmentsRes.data || []);

      let allSubmissions = [];
      if (assignmentsRes.data && assignmentsRes.data.length > 0) {
        for (const assignment of assignmentsRes.data.slice(0, 3)) {
          try {
            const submissionsRes = await submissionAPI.getByAssignment(
              assignment._id
            );
            if (submissionsRes.data) {
              allSubmissions = [...allSubmissions, ...submissionsRes.data];
            }
          } catch (error) {
            console.warn(`Could not fetch submissions for ${assignment.title}`);
          }
        }
      }
      setSubmissions(allSubmissions);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-300">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Loading...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Generate Marksheet
          </h1>
          <p className="text-gray-400">
            Create Excel marksheets for evaluated assignments
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6">
            <strong>Error: </strong>
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1   gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {assignments.length}
            </div>
            <div className="text-sm text-gray-400">Total Assignments</div>
          </div>
        </div>

        {/* Marksheet Component */}
        <Marksheet assignments={assignments} />

        {/* Help Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-3">Need Help?</h3>
          <div className="space-y-2 text-gray-300">
            <p>
              <strong className="text-white">Marksheet not generating?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
              <li>Make sure submissions are evaluated first</li>
              <li>Check if the assignment has submissions</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
