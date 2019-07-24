const express = require("express"),
  cors = require("cors"),
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

//connect to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.info("Database successfully connected");
  })
  .catch(error => console.log(error));

//Custom routes

app.use('/api/tasks',taskRoutes);
app.use('/api/users',userRoutes);

//404 default route

app.use((req, res) => {
  res.status(404).json({ error: true, message: "Route unavailable" });
});

const PORT = process.env.PORT || 8088;

app.listen(PORT,() => {
  console.info(`The app is listening on port ${PORT}`);
});
