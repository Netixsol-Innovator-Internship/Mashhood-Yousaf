const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const checkToken = require("../middlewares/verifyToken");

router.get("/stats", taskController.getStats);
router.get("/", taskController.getTask);

// protectedRoutes
router.post("/", checkToken, taskController.createTask);
router.get("/:id", checkToken, taskController.getTaskByID);
router.put("/:id", checkToken, taskController.updateTask);
router.delete("/:id", checkToken, taskController.deleteTask);

module.exports = router;
