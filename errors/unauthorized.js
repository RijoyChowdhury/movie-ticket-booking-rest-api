const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super("Unauthorized", StatusCodes.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;
