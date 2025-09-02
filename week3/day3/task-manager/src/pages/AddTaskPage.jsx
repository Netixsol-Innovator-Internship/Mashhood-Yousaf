import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const AddTaskPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Fields with * are required");
      return;
    }

    if(title.length < 3 || description.length < 5 ) {
      return setError("Title minimum length should be 3 and for description is 5")
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized access, please login.");
        return;
      }

      const response = await axios.post(
        "https://day1-back-end.vercel.app/api/tasks/",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Task added:", response.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add task:", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   if (loading) {
      return <Loader />;
   }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Task</h2>

      {error && (
        <p className="mb-4 text-red-600 font-medium bg-red-100 p-3 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block mb-1 font-medium text-gray-700"
          >
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-1 font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTaskPage;
