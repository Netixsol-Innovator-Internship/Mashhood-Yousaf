// src/server.ts
const express = require("express");
const cors = require("cors");
import type { Request, Response } from "express";
import type { Task } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

let tasks: Task[] = [];
let nextId = 1;

// GET all tasks
app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

// POST new task
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask: Task = { id: nextId++, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT toggle task complete/incomplete
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10); // ✅ type-safe
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.completed = !task.completed;
  res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10); // ✅ type-safe
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
