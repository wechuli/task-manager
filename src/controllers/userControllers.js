const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { formatAvatarPhoto } = require("../helpers/imageFormatter");
const {
  sendWelcomeEmail,
  sendCancellationEmail
} = require("../helpers/emails");

module.exports = {
  async CreateNewUser(req, res) {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      sendWelcomeEmail({ email: newUser.email, name: newUser.name });

      //note - the generateAuthToken is on the specific document
      const token = await newUser.generateAuthToken();
      res
        .status(201)
        .json({ message: "new user created", newUser, token, error: false });
    } catch (error) {
      // console.log(error);
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
  async UpdateOwnProfile(req, res) {
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

    try {
      // // Instead of using findByIdAndUpdate we can just find the document and manually update it so our mongoose middleware would kick in
      // const updatedUser = await User.findById(id);

      // we have the user object on req.user from the authentication middleware

      updates.forEach(update => {
        req.user[update] = req.body[update];
      });
      // const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      //   new: true,
      //   runValidators: true
      // });

      await req.user.save();
      // if (!updatedUser) {
      //   return res
      //     .status(404)
      //     .json({ error: true, message: "User unavailable" });
      // }
      res.status(200).json({ error: false, updatedUser: req.user });
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  },

  async DeleteOwnProfile(req, res) {
    // const { _id } = req.user;
    try {
      // const deletedUser = await User.findByIdAndDelete(_id);
      // if (!deletedUser) {
      //   return res
      //     .status(404)
      //     .json({ error: true, message: "User unavailable" });
      // }

      await req.user.remove();
      sendCancellationEmail({ email: req.user.email, name: req.user.name });
      res.status(200).json({ error: false, deletedUser: req.user });
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
  },

  async LogoutUser(req, res) {
    try {
      req.user.tokens = req.user.tokens.filter(token => {
        return token.token !== req.token;
      });

      await req.user.save();

      res
        .status(200)
        .json({ error: false, message: "User successfully logged out" });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },
  async LogoutAllUsers(req, res) {
    try {
      req.user.tokens = [];
      await req.user.save();
      console.log(req.user);
      res.status(200).json({
        error: false,
        message: "Successfully logged out of all sessions."
      });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },

  async UploadProfilePic(req, res) {
    try {
      // req.user.avatar = req.file.buffer;
      req.user.avatar = await formatAvatarPhoto(req.file.buffer);
      await req.user.save();
      res
        .status(200)
        .json({ error: false, message: "Avatar successfully uploaded" });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },
  async DeleteAvatar(req, res) {
    try {
      req.user.avatar = undefined;
      req.user.save();

      res
        .status(200)
        .json({ error: false, message: "Image successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: true, message: error });
    }
  },
  async GetAvatarById(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);

      if (!user || !user.avatar) {
        throw new Error();
      }
      res.set("Content-Type", "image/png");
      res.send(user.avatar);
    } catch (error) {
      res.status(404).json({ error: true, message: error });
    }
  }
};
