import React, { useState } from "react";
import { assignmentAPI } from "../app/utils/api";
import { FilePlus } from "lucide-react";

const AssignmentForm = ({ onAssignmentCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    minLength: 500,
    maxMarks: 100,
    gradingMode: "strict",
    teacherName: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await assignmentAPI.create(formData);
      setMessage("Assignment created successfully!");
      setFormData({
        title: "",
        description: "",
        instructions: "",
        minLength: 500,
        maxMarks: 100,
        gradingMode: "strict",
        teacherName: "",
      });

      if (onAssignmentCreated) {
        onAssignmentCreated(response.data);
      }
    } catch (error) {
      setMessage(
        "Error creating assignment: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-100">
        <FilePlus className="text-green-400" /> Create New Assignment
      </h2>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${
            message.includes("Error")
              ? "bg-red-900/40 text-red-400 border border-red-700"
              : "bg-green-900/40 text-green-400 border border-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Assignment Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter assignment title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="2"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter assignment description"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Instructions *
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter detailed instructions for students"
          />
        </div>

        {/* Grading Mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Grading Mode *
            </label>
            <select
              name="gradingMode"
              value={formData.gradingMode}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="strict">Strict</option>
              <option value="loose">Loose</option>
            </select>
          </div>
        </div>

        {/* Teacher Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Teacher Name *
          </label>
          <input
            type="text"
            name="teacherName"
            value={formData.teacherName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        >
          {loading ? "Creating Assignment..." : "Create Assignment"}
        </button>
      </form>
    </div>
  );
};

export default AssignmentForm;
