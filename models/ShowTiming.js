const mongoose = require("mongoose");
// const Movie = require("./Movie");

const showTimingSchema = new mongoose.Schema({
  hallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Moviehall",
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
  showTimes: [{ start: Number, availableSeats: Number }],
});

module.exports = mongoose.model("Showtiming", showTimingSchema);
