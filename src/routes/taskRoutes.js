const express = require("express");
const auth = require("../helpers/auth");
const {
  CreateNewTask,
  GetAllTasks,
  GetSingleTask,
  UpdateSingleTask,
  DeleteSingleTask
} = require("../controllers/taskControllers");

const router = new express.Router();

// create a new task
router.post("/create", auth, CreateNewTask);

//get all tasks ?completed=true
// limit=10, skip=0
// sortBy=createdAt_asc/createdAt_desc

router.get("/all", auth, GetAllTasks);

//get single task
router.get("/single/:id", auth, GetSingleTask);

//update a single task
router.patch("/single/:id", auth, UpdateSingleTask);

//delete a single task

router.delete("/single/:id", auth, DeleteSingleTask);

module.exports = router;
