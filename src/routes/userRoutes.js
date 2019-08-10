const express = require("express");
const auth = require("../helpers/auth");

const multer = require("multer");
const {
  CreateNewUser,
  GetAllUsers,
  GetSingleUser,
  UpdateOwnProfile,
  DeleteOwnProfile,
  LoginUser,
  GetOwnProfile,
  LogoutUser,
  LogoutAllUsers,
  UploadProfilePic
} = require("../controllers/userControllers");

const router = new express.Router();

//setup multer

const upload = multer({
  dest: "avatars",
  limits: {
    fileSize: 1000000
  },
  fileFilter(){
    
  }
});

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

//upload profile pic in datbase

router.post("/user/me/avatar", auth, upload.single("avatar"), UploadProfilePic);

//Get a particular user in db

// router.get("/single/:id", GetSingleUser);

//update an existing user

router.patch("/user/me", auth, UpdateOwnProfile);

//Delete a user
router.delete("/user/me", auth, DeleteOwnProfile);

module.exports = router;
