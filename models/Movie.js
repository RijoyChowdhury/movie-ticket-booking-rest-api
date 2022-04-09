const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: [true, "Movie name missing"],
  },
  duration: {
    type: Number,
    required: [true, "Movie Duration missing"],
  },
});

module.exports = mongoose.model("Movie", movieSchema);
