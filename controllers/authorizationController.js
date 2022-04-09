const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} = require("../errors");
const User = require("../models/User");

const handleAuthorisation = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    throw new BadRequestError("username/password is required");

  const user = await User.findOne({ username }).exec();
  if (!user) throw new NotFoundError("user does not exist");

  try {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: user.username,
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );

      res.status(200).json({ success: true, accessToken });
    } else throw new UnauthorizedError();
  } catch (err) {
    throw new InternalServerError();
  }
};

module.exports = { handleAuthorisation };
