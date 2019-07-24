const User = require("../models/User.model");

module.exports = {
  async CreateNewUser(req, res) {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res
        .status(201)
        .json({ message: "new user created", newUser, error: false });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  }
};
