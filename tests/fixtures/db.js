const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/User.model");
const Task = require("../../src/models/Task.model");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Paul",
  email: "wechulipaul1@gmail.com",
  password: "56what!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Jess",
  email: "jess@gmail.com",
  password: "thisisadsdsd",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First mock task",
  completed: false,
  owner: userOneId
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second mock task",
  completed: true,
  owner: userTwoId
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third mock task",
  completed: true,
  owner: userTwoId
};

const setupDatabase = async done => {
  jest.setTimeout(20000);
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  done();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
};
