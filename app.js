require("dotenv").config();
require("express-async-errors");
const express = require("express");
const moviesRouter = require("./routes/movieRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/movies", moviesRouter);
app.use("/", (req, res) => {
  res.status(200).json({ serviceAvailable: true });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
