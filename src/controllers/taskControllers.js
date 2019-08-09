const Task = require("../models/Task.model");

module.exports = {
  async CreateNewTask(req, res) {
    const { _id } = req.user;
    try {
      const newTask = new Task({
        ...req.body,
        owner: _id
      });
      await newTask.save();
      res
        .status(201)
        .json({ error: false, message: "New task created", newTask });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },
  async GetAllTasks(req, res) {
    const { _id } = req.user;
    const match = {};
    const sort = {};

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    console.log(match);
    try {
      // let allTasks;
      // if (req.query.completed) {
      //   allTasks = await Task.find({ owner: _id, completed: match.completed });
      // } else {
      //   allTasks = await Task.find({ owner: _id });
      // }

      // You could use below to do the same this - using the virtual property we created

      await req.user
        .populate({
          path: "tasks",
          match,
          options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
          }
        })
        .execPopulate();
      res.status(200).json({ error: false, tasks: req.user.tasks });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },
  async GetSingleTask(req, res) {
    // get only the tasks authored by the logged in user

    const { id } = req.params;
    try {
      const task = await Task.findOne({ _id: id, owner: req.user._id });
      if (!task) {
        return res.status(404).json({ error: true, message: "Task not found" });
      }
      res.status(200).json({ error: false, task });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },

  async UpdateSingleTask(req, res) {
    //Make sure updates conform to a particular set of allowed objects

    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];

    const isValidUpdateField = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidUpdateField) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid update fields" });
    }
    const { id } = req.params;
    try {
      //find the task if it owned by the logged in user
      const updatedTask = await Task.findOne({ _id: id, owner: req.user._id });

      if (!updatedTask) {
        return res
          .status(404)
          .json({ error: true, message: "Task unavailable" });
      }

      updates.forEach(update => {
        updatedTask[update] = req.body[update];
      });

      // const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      //   new: true,
      //   runValidators: true
      // });

      updatedTask.save();
      res.status(200).json({ error: false, updatedTask });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },
  async DeleteSingleTask(req, res) {
    const { id } = req.params;
    try {
      const deletedTask = await Task.findOneAndDelete({
        _id: id,
        owner: req.user._id
      });
      if (!deletedTask) {
        return res
          .status(404)
          .json({ error: true, message: "Task unavailable" });
      }
      res.status(200).json({ error: false, deletedTask });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  }
};
