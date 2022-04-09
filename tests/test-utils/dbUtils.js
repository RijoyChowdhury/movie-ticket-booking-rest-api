const Showtiming = require("../../models/ShowTiming");
const User = require("../../models/User");

const createShowtimingEntry = async (payload) => {
  await Showtiming.create(payload);
};

const createUserEntry = async (payload) => {
  await User.create(payload);
};

module.exports = { createShowtimingEntry, createUserEntry };
