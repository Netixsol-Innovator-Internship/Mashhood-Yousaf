"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import AssignmentForm from "../../components/AssignmentForm";
import { assignmentAPI } from "../utils/api";
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getAll();
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentCreated = (newAssignment) => {
    setAssignments([newAssignment, ...assignments]);
    fetchAssignments();  
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
            Loading assignments...
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Assignment Management
          </h1>
          <p className="text-gray-400">
            Create and manage assignments for your students
          </p>
        </div>

        {/* Form */}
        <AssignmentForm onAssignmentCreated={handleAssignmentCreated} />

        {/* Assignments List */}
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-100">
            <ClipboardList className="text-blue-400" /> All Assignments
          </h2>

          {assignments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No assignments created yet. Create your first assignment above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <motion.div
                  key={assignment._id}
                  className="bg-gray-900 border border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-blue-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-bold text-lg text-gray-100 mb-2">
                    {assignment.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {assignment.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex justify-between">
                      <span>Teacher:</span>
                      <span className="font-medium text-gray-200">
                        {assignment.teacherName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Words:</span>
                      <span className="font-medium text-gray-200">
                        {assignment.minLength}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grading:</span>
                      <span
                        className={`font-medium ${
                          assignment.gradingMode === "strict"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {assignment.gradingMode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium text-gray-200">
                        {new Date(assignment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
