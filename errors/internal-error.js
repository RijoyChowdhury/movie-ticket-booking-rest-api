const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class InternalServerError extends CustomAPIError {
  constructor() {
    super("Internal Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = InternalServerError;
