const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super("Forbidden", StatusCodes.FORBIDDEN);
  }
}

module.exports = ForbiddenError;
