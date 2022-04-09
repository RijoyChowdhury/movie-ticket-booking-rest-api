const express = require("express");
const {
  getAllMovies,
  getMovie,
  addNewMovie,
  getAllMovieHalls,
  addNewMovieHall,
  getAllActiveMovie,
  addNewMovieToHall,
  bookShow,
} = require("../controllers/moviesController");

const { verifyAuthorisation } = require("../middleware/verify-authorization");

const Router = express.Router();

Router.route("/").get(getAllMovies).post(addNewMovie);

Router.route("/movieHalls").get(getAllMovieHalls).post(addNewMovieHall);
Router.route("/showTimings")
  .get(getAllActiveMovie)
  .post(verifyAuthorisation, bookShow);
Router.route("/showTimings/addMovieToHall").post(addNewMovieToHall);

module.exports = Router;
