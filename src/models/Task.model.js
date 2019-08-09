const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      required: false,
      default: false
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users"
    }
  },
  { timestamps: true }
);

module.exports = model("tasks", taskSchema);
