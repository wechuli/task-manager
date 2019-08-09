const express = require("express");
const auth = require("../helpers/auth");
const {
  CreateNewUser,
  GetAllUsers,
  GetSingleUser,
  UpdateOwnProfile,
  DeleteOwnProfile,
  LoginUser,
  GetOwnProfile,
  LogoutUser,
  LogoutAllUsers
} = require("../controllers/userControllers");

const router = new express.Router();

// Create a new user
router.post("/create", CreateNewUser);

//login user

router.post("/login", LoginUser);

//logout
router.post("/user/logout", auth, LogoutUser);

//logout all sessions
router.post("/user/logout/all", auth, LogoutAllUsers);

//get all users in the db
router.get("/all", auth, GetAllUsers);

// get your own profile

router.get("/user/me", auth, GetOwnProfile);

//Get a particular user in db

// router.get("/single/:id", GetSingleUser);

//update an existing user

router.patch("/user/me",auth, UpdateOwnProfile);

//Delete a user
router.delete("/user/me", auth, DeleteOwnProfile);

module.exports = router;
