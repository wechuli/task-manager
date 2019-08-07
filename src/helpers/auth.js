const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    //get the token
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewcourse");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error("Auth problem");
    }
    req["user"] = user;
    next();
  } catch (error) {
    res.status(401).json({ error: true, message: "Authentication Invalid" });
  }
};

module.exports = auth;
