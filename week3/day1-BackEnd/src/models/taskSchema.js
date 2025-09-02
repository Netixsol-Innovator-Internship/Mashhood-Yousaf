const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, required: true },
  creatorUser: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Task", taskSchema);
