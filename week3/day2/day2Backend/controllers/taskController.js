const Task = require("../models/Task");
const { validationResult } = require("express-validator");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, completed } = req.body;
  const task = new Task({ title, completed, user: req.user.id });
  await task.save();
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ msg: "Task not found" });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
  if (!task) return res.status(404).json({ msg: "Task not found" });
  res.json({ msg: "Task deleted" });
};

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn MongoDB with Mongoose
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
