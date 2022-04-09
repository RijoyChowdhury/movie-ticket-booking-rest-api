const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../errors");

const verifyAuthorisation = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) throw new UnauthorizedError();
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) throw new ForbiddenError();
    req.user = {
      username: decoded.userInfo.username,
      email: decoded.userInfo.email,
    };
    next();
  });
};

module.exports = { verifyAuthorisation };
