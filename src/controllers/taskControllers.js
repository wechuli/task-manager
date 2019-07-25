const Task = require("../models/Task.model");

module.exports = {
  async CreateNewTask(req, res) {
    try {
      const newTask = new Task(req.body);
      await newTask.save();
      res
        .status(201)
        .json({ error: false, message: "New task created", newTask });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },
  async GetAllTasks(req, res) {
    try {
      const allTasks = await Task.find({});
      res.status(200).json({ error: false, tasks: allTasks });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },
  async GetSingleTask(req, res) {
    const { id } = req.params;
    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: true, message: "Task not found" });
      }
      res.status(200).json({ error: false, task });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  }
};
