const express = require("express");
const {
  CreateNewTask,
  GetAllTasks,
  GetSingleTask
} = require("../controllers/taskControllers");

const router = express.Router();

// create a new task
router.post("/create", CreateNewTask);

//get all tasks

router.get("/all", GetAllTasks);

//get single task
router.get("/single/:id", GetSingleTask);

module.exports = router;
