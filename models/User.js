const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is mandatory."],
  },
  password: {
    type: String,
    required: [true, "Password is mandatory."],
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    lowercase: true,
    trim: true,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
