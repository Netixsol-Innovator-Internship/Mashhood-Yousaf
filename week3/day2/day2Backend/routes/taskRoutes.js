const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { body } = require("express-validator");
const auth = require("../middleware/auth");

const router = express.Router();
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve all tasks assigned to the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A collection of tasks belonging to the current user
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Add a new task to your list
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
 *                 example: Practice MongoDB with Mongoose
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Task successfully added
 *       400:
 *         description: Invalid request data
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Modify an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the task
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Practice MongoDB with Mongoose
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task could not be found
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Remove a task from your list
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task could not be found
 */

router.get("/", auth, getTasks);
router.post("/", auth, [body("title").notEmpty()], createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
