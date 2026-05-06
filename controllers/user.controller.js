const userService = require("../services/user.service");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    await userService.createUser(email, password, name, role);
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.userId);
    return res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

userController.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    const { user, token } = await userService.loginWithGoogle(idToken);
    return res.status(200).json({ status: "success", user, token });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = userController;
