// Dashboard.js
"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { assignmentAPI, submissionAPI } from "../app/utils/api";
import { motion } from "framer-motion";
import { ClipboardList, Upload, FileSpreadsheet, FileText } from "lucide-react";

export default function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        assignmentAPI.getAll(),
        submissionAPI.getByAssignment(""),
      ]);
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <motion.div
            className="text-lg text-gray-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-10">
        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Assignments */}
          <motion.div
            className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-100">
              <ClipboardList className="text-blue-400" /> Recent Assignments
            </h2>

            {assignments.slice(0, 5).map((assignment) => (
              <motion.div
                key={assignment._id}
                className="border-b border-gray-700 py-4 last:border-b-0 group"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="font-semibold text-gray-200 group-hover:text-blue-400 transition">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {assignment.teacherName}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      assignment.gradingMode === "strict"
                        ? "bg-red-900/40 text-red-400"
                        : "bg-green-900/40 text-green-400"
                    }`}
                  >
                    {assignment.gradingMode}
                  </span>
                </div>
              </motion.div>
            ))}

            {assignments.length === 0 && (
              <p className="text-gray-500 text-center py-6">
                No assignments created yet
              </p>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-100">
            <FileText className="text-purple-400" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/assignments"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl text-center font-medium shadow hover:shadow-lg hover:bg-blue-700 transition-all"
            >
              <ClipboardList size={18} /> Create Assignment
            </a>
            <a
              href="/submissions"
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl text-center font-medium shadow hover:shadow-lg hover:bg-green-700 transition-all"
            >
              <Upload size={18} /> Upload Submissions
            </a>
            <a
              href="/marksheet"
              className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 px-4 rounded-xl text-center font-medium shadow hover:shadow-lg hover:bg-purple-700 transition-all"
            >
              <FileSpreadsheet size={18} /> Generate Marksheet
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
