const express = require("express");
const {
  CreateNewUser,
  GetAllUsers,
  GetSingleUser,
  UpdateSingleUser,
  DeleteSingleUser
} = require("../controllers/userControllers");

const router = express.Router();

// Create a new user
router.post("/create", CreateNewUser);

//get all users in the db
router.get("/all", GetAllUsers);

//Get a particular user in db

router.get("/single/:id", GetSingleUser);

//update an existing user

router.patch("/single/:id", UpdateSingleUser);

//Delete a user
router.delete("/single/:id", DeleteSingleUser);

module.exports = router;
