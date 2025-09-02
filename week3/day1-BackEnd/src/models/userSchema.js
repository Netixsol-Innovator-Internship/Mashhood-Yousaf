// src/models/userSchema.js
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    tasks: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  },
  { timestamps: true }
);

// default tasks array so new users don't violate validators

module.exports = mongoose.model("User", userSchema);
