// src/App.tsx
import React, { useState, useEffect } from "react";
import { Task } from "./types";

const STORAGE_KEY = "tasks";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Load tasks from localStorage (and then sync with backend)
  useEffect(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      setTasks(JSON.parse(localData));
    }
    fetchTasks();
  }, []);

  // Keep localStorage in sync whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://mashhood-todo-tsc-week4-d1.vercel.app/api/tasks"
      );
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("(error)", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Task title is required!");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle("");

    try {
      const res = await fetch(
        "https://mashhood-todo-tsc-week4-d1.vercel.app/api/tasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        }
      );
      const savedTask = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === newTask.id ? savedTask : t))
      );
    } catch (error) {
      console.error("(error)", error);
    } 
  };

  const toggleTask = async (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      const res = await fetch(
        `https://mashhood-todo-tsc-week4-d1.vercel.app/api/tasks/${id}`,
        {
          method: "PUT",
        }
      );
      const updatedTask = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error("(error)", error);
    } 
  };

  const deleteTask = async (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));

    try {
      await fetch(
        `https://mashhood-todo-tsc-week4-d1.vercel.app/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error("(error)", error);
    } 
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-10 animate-background">
      <div className="w-full max-w-2xl bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-500 animate-fadeIn">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-10 tracking-wide animate-pulse">
          🚀 Todo Mission Control
        </h1>

        {/* Input Area */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="💡 Add your next big idea..."
            className="flex-1 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md"
          />
          <button
            onClick={addTask}
            className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            ➕ Add
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-white/80 text-sm mb-4 animate-pulse">
            🔄 Loading tasks...
          </p>
        )}

        {/* Tasks List */}
        <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
          {tasks.map((task, index) => (
            <li
              key={task.id}
              className="bg-white/80 border border-white/30 px-4 py-3 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] animate-slideUp"
            >
              <span
                onClick={() => toggleTask(task.id)}
                className={`cursor-pointer text-sm sm:text-base font-medium transition select-none ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800 hover:text-indigo-600"
                }`}
              >
                {task.completed ? "✅" : "🎯"} {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 transition text-lg"
                title="Delete"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/20 text-white font-semibold text-sm text-center p-4 rounded-xl shadow-inner border border-white/30">
          <span>✅ Done: {completedCount}</span>
          <span>🧠 Pending: {pendingCount}</span>
          <span>📋 Total: {tasks.length}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
