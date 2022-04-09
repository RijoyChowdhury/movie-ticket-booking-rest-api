const CustomAPIError = require("./custom-api");
const UnauthorizedError = require("./unauthorized");
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const InternalServerError = require("./internal-error");
const ForbiddenError = require("./forbidden");

module.exports = {
  CustomAPIError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  ForbiddenError,
};
