const User = require("../Model/User");
const Cart = require("../Model/Cart");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userController = {};

const ensureCartForUser = async (userId) => {
  const existing = await Cart.findOne({ userId });
  if (!existing) {
    await Cart.create({ userId });
  }
};

//회원 가입
userController.createUser = async (req, res) => {
  try {
    let { email, password, name, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("use already exist");
    }
    const salt = await bcrypt.genSaltSync(10);
    password = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password,
      name,
      role: role ? role : "customer",
    });
    await newUser.save();
    await ensureCartForUser(newUser._id);
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

//유저 로그인
userController.getUser = async (req,res) =>{
  try{
    const {userId} = req;
    const user = await User.findById(userId);
    if(user){
      return res.status(200).json({
        status: "success",
        user
      })
    }
    throw new Error("invalid token")
  }catch{
    res.status(400).json({
      status: "error", error: error.message
    })
  }
}

// Google login: verify idToken, create user if not exists, return app token
userController.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
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

    await ensureCartForUser(user._id);
    const token = await user.generateToken();
    return res.status(200).json({ status: "success", user, token });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};



module.exports = userController;
