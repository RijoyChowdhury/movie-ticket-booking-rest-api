const bcrypt = require("bcrypt");
const { BadRequestError, InternalServerError } = require("../errors");
const User = require("../models/User");

const registerNewUser = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new BadRequestError("username/password/email is required");
  }

  const duplicates = await User.findOne({ username }).exec();
  if (duplicates) return res.sendStatus(409);

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND)
    );
    const result = await User.create({
      username,
      password: hashedPassword,
      email,
    });
    res.status(201).json({ success: true });
  } catch (err) {
    throw new InternalServerError();
  }
};

module.exports = { registerNewUser };
