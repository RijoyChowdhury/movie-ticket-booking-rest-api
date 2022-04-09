const { StatusCodes } = require("http-status-codes");
const Movie = require("../models/Movie");
const Moviehall = require("../models/MovieHall");
const Showtiming = require("../models/ShowTiming");
const { BadRequestError } = require("../errors");

const getAllMovies = async (req, res) => {
  const data = await Movie.find({});
  res.status(200).json({ data });
};

const addNewMovie = async (req, res) => {
  const data = await Movie.create(req.body);
  res.status(201).json({ data });
};

const getMovie = async (req, res) => {
  res.status(200).json({ id: req.params.id });
};

const getAllMovieHalls = async (req, res) => {
  const data = await Moviehall.find({});
  res.status(200).json({ data });
};

const addNewMovieHall = async (req, res) => {
  const data = await Moviehall.create(req.body);
  res.status(201).json({ data });
};

const getAllActiveMovie = async (req, res) => {
  const { movieId, hallId, time } = req.query;
  const queryObj = {};
  if (movieId) {
    queryObj.movieId = movieId;
  }
  if (hallId) {
    queryObj.hallId = hallId;
  }
  if (time) {
    queryObj["showTimes.start"] = time;
  }
  let result = Showtiming.find(queryObj);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const data = await result;

  res.status(200).json({ data });
};

const addNewMovieToHall = async (req, res) => {
  const data = await Showtiming.create(req.body);
  res.status(201).json({ data });
};

const bookShow = async (req, res) => {
  const { movieId, hallId, time } = req.query;
  const { quantity } = req.body;
  const queryObj = {};
  if (movieId) {
    queryObj.movieId = movieId;
  }
  if (hallId) {
    queryObj.hallId = hallId;
  }
  if (time) {
    queryObj["showTimes.start"] = time;
  }
  let result = Showtiming.findOne(queryObj);

  const data = await result;
  const index = data.showTimes.findIndex(
    (showtime) => showtime.start === Number(time)
  );

  const totalSeatsBooked =
    data.showTimes[index].availableSeats + Number(quantity);
  if (totalSeatsBooked <= 60) {
    //assuming total seats to be 60
    data.showTimes[index].availableSeats = totalSeatsBooked;
    data.save();
  } else {
    throw new BadRequestError("Seats Unavailable");
  }
  res.status(200).json({
    success: true,
    seatsBooked: quantity,
    shiftId: data.showTimes[index]._id,
  });
};

module.exports = {
  getAllMovies,
  getMovie,
  addNewMovie,
  getAllMovieHalls,
  addNewMovieHall,
  getAllActiveMovie,
  addNewMovieToHall,
  bookShow,
};
