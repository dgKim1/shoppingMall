const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../model/User");
const cartService = require("./cart.service");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const userService = {};

userService.createUser = async (email, password, name, role) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("user already exist");
  }
  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    email,
    password: hashedPassword,
    name,
    role: role || "customer",
  });
  await user.save();
  await cartService.ensureCartForUser(user._id);
};

userService.getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("invalid token");
  }
  return user;
};

userService.loginWithGoogle = async (idToken) => {
  if (!idToken) {
    throw new Error("idToken is required");
  }
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("invalid google token");
  }

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    const randomPassword = crypto.randomBytes(16).toString("hex");
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);
    user = new User({
      email: payload.email,
      password: hashedPassword,
      name: payload.name || payload.email,
      role: "customer",
    });
    await user.save();
  }

  await cartService.ensureCartForUser(user._id);
  const token = await user.generateToken();
  return { user, token };
};

module.exports = userService;
