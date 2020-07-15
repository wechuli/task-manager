const express = require("express"),
 const cors = require("cors"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  helmet = require("helmet");

//custom imports
const taskRoutes = require("./routes/taskRoutes"),
  userRoutes = require("./routes/userRoutes");

const app = express();

//middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(process.env.MONGO_URI);
//connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.info("Database successfully connected");
  })
  .catch(error => console.log(error));

//Custom routes

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

//404 default route

app.use((req, res) => {
  res.status(404).json({ error: true, message: "Route unavailable" });
});
module.exports = app;
