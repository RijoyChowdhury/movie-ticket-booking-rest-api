const express = require("express");
const {
  handleAuthorisation,
} = require("../controllers/authorizationController");
const { registerNewUser } = require("../controllers/registrationController");

const Router = express.Router();

Router.route("/login").post(handleAuthorisation);
Router.route("/register").post(registerNewUser);

module.exports = Router;
