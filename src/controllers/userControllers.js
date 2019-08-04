const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

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
    try {
      const user = await User.findByCredentials(email, password);
      
      res.status(200).json({ error: false, user });
    } catch (error) {
      res.status(400).json({ error: true, error });
    }
  }
};
