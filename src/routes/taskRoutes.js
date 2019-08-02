const express = require("express");
const {
  CreateNewTask,
  GetAllTasks,
  GetSingleTask,
  UpdateSingleTask,
  DeleteSingleTask
} = require("../controllers/taskControllers");

const router = new express.Router();

// create a new task
router.post("/create", CreateNewTask);

//get all tasks

router.get("/all", GetAllTasks);

//get single task
router.get("/single/:id", GetSingleTask);

//update a single task
router.patch("/single/:id", UpdateSingleTask);

//delete a single task

router.delete("/single/:id", DeleteSingleTask);

module.exports = router;
