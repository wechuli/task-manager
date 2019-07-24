const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = model("tasks", taskSchema);
