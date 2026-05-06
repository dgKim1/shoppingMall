const authService = require("../services/auth.service");

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginWithEmail(email, password);
    return res.status(200).json({ status: "success", user, token });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

authController.authenticate = async (req, res, next) => {
  try {
    const userId = authService.verifyToken(req.headers.authorization);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    await authService.checkAdminPermission(req.userId);
    next();
  } catch (error) {
    res.status(403).json({ status: "fail", error: error.message });
  }
};

authController.logout = async (req, res) => {
  return res.status(200).json({ status: "success" });
};

module.exports = authController;
