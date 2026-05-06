const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authService = {};

authService.loginWithEmail = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("invalid email or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("invalid email or password");
  }
  const token = await user.generateToken();
  return { user, token };
};

authService.verifyToken = (tokenString) => {
  if (!tokenString) {
    throw new Error("token not found");
  }
  const token = tokenString.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET_KEY);
  return payload._id;
};

authService.checkAdminPermission = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("user not found");
  }
  if (user.role !== "admin") {
    throw new Error("permission denied");
  }
};

module.exports = authService;
