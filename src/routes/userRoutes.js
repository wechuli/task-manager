const express = require("express");
const { CreateNewUser } = require("../controllers/userControllers");

const router = express.Router();

// Create a new user
router.post("/create", CreateNewUser);

module.exports = router;
