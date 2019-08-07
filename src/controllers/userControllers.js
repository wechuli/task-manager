const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

module.exports = {
  async CreateNewUser(req, res) {
    try {
      const newUser = new User(req.body);
      await newUser.save();

      //note - the generateAuthToken is on the specific document
      const token = await newUser.generateAuthToken();
      res
        .status(201)
        .json({ message: "new user created", newUser, token, error: false });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },
  async GetAllUsers(req, res) {
    try {
      const allUsers = await User.find({});
      res.status(200).json({ error: false, users: allUsers });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },
  async GetSingleUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ error: true, message: "User unavailable" });
      }
      res.status(200).json({ error: false, user });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },
  async UpdateSingleUser(req, res) {
    //Make sure updates conform to a particular set of allowed objects

    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];

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
      // Instead of using findByIdAndUpdate we can just find the document and manually update it so our mongoose middleware would kick in
      const updatedUser = await User.findById(id);

      updates.forEach(update => {
        updatedUser[update] = req.body[update];
      });
      // const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      //   new: true,
      //   runValidators: true
      // });

      await updatedUser.save();
      if (!updatedUser) {
        return res
          .status(404)
          .json({ error: true, message: "User unavailable" });
      }
      res.status(200).json({ error: false, updatedUser });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },

  async DeleteSingleUser(req, res) {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res
          .status(404)
          .json({ error: true, message: "User unavailable" });
      }
      res.status(200).json({ error: false, deletedUser });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },

  async LoginUser(req, res) {
    // we can add our own functions on the models we create by mongoose
    const { email, password } = req.body;
    console.log(req.body);
    try {
      //note the findByCredentials method is on the Model/Collection since it involves searching through the whole collection
      const user = await User.findByCredentials(email, password);

      //note - the generateAuthToken is on the specific document
      const token = await user.generateAuthToken();

      res.status(200).json({ error: false, user, token });
    } catch (error) {
      res.status(401).json({ error: true, error });
    }
  },
  async GetOwnProfile(req, res) {
    const { user } = req;
    try {
      res.status(200).json({ error: false, user });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  }
};
