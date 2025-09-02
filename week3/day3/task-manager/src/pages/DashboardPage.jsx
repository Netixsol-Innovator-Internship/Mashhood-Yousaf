// src/pages/DashboardPage.jsx
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditTaskModal from "../components/EditTaskModel";
import Loader from '../components/Loader'
// import TaskList from "../components/TaskList";
// import TaskForm from "../components/TaskForm";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // const tasksArray = [
    //   {
    //     _id: "1",
    //     title: "Build Login Page",
    //     description: "Create a login form with validation and token handling.",
    //     completed: true,
    //   },
    //   {
    //     _id: "2",
    //     title: "Add Edit Functionality",
    //     description: "Allow users to edit tasks from the dashboard.",
    //     completed: false,
    //   },
    // ];

    // setTasks(tasksArray);

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized. Please login.");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        console.log("userId", userId);
        const response = await axios.get(
          `https://day1-back-end.vercel.app/api/tasks/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response while gettind user for dashboard", response.data);

        setTasks(response.data.data);
        console.log("tasks", tasks);
      } catch (err) {
        console.log("err catched", err);
        setError(err.response.data.message );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    console.log("task from handle Edit function", task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (taskId, updatedTaskData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://day1-back-end.vercel.app/api/tasks/${taskId}`,
        updatedTaskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response);
      // Update task in UI
      const updatedTask = response.data.data;
      console.log("updatedTask", updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );

      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    let confirmDelete = confirm("Do You really want to delete Task");

    if (confirmDelete) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          return setError("UnAuthorized Access, Calling... 15");
        }

        const response = await axios.delete(
          `https://day1-back-end.vercel.app/api/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const filteredTask = tasks.filter((task) => task._id !== taskId);
        setTasks(filteredTask);
        console.log("filteredTask", filteredTask);
        console.log("response", response);

        setIsModalOpen(false);
        setEditingTask(null);
      } catch (err) {
        console.error("deleting error:", err);
        setError(err.response?.data?.message || "Failed to update task");
      } finally {
        setLoading(false);
      }
    }
    console.log("taskId", taskId);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6">
        Your Task Dashboard
      </h1>
      <div className="flex justify-end items-center mb-6">
        <Link
          to="/addTask"
          className="px-6 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
        >
          Add Task
        </Link>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {task.task}
            </h2>
            <p className="text-gray-600 mb-4">{task.description}</p>

            <div className="flex justify-between items-center">
              {/* Smaller status label */}
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded 
            ${
              task.completed
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
              >
                {task.completed ? "✓ Completed" : "⏳ Pending"}
              </span>

              {/* Button row (left aligned) */}
              <div className="flex gap-2 mts-4">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-8">No tasks found.</p>
      )}
      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleUpdateTask}
        task={editingTask}
      />
    </div>
  );
};

export default DashboardPage;
