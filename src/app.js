const express = require("express"),
  cors = require("cors"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  helmet = require("helmet");

const app = express();

//middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Custom routes

//404 default route

app.use((req, res) => {
  res.status(404).json({ error: true, message: "Route unavailable" });
});

const PORT = process.env.PORT || 8088;

app.listen(() => {
  console.info(`The app is listening on port ${PORT}`);
});
