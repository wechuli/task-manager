const express = require("express");
const auth = require("../helpers/auth");
const upload = require("../helpers/fileUploads");
const sharp = require("sharp");
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
  UploadProfilePic,
  DeleteAvatar,
  GetAvatarById
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

//upload profile pic in datbase - we can provide a 4th callback to handle any errors from the file upload

router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  UploadProfilePic,
  (error, req, res, next) => {
    res.status(400).json({ error: true, message: error.message });
  }
);

//get avatar

router.get("/user/:id/avatar", GetAvatarById);

//Delete avatar

router.delete("/user/me/avatar", auth, DeleteAvatar);
//Get a particular user in db

// router.get("/single/:id", GetSingleUser);

//update an existing user

router.patch("/user/me", auth, UpdateOwnProfile);

//Delete a user
router.delete("/user/me", auth, DeleteOwnProfile);

module.exports = router;
