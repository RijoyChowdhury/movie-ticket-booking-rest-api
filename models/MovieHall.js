const mongoose = require("mongoose");

const movieHallSchema = new mongoose.Schema({
  hallName: String,
});

module.exports = mongoose.model("Moviehall", movieHallSchema);
