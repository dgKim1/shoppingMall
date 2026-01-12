const User = require("../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotconfig");

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    let {email,password} = req.body;
    let user = await User.findOne({email})
    if(user){
      const isMatch = await bcrypt.compare(password,user.password);
      if(isMatch){
        const token = await user.generateToken();
        return res.status(200).json({status:"success", user, token});
      }
      throw new Error("isvalid email or password")
    }} catch(error){
      res.status(400).json({status: "fail", error: error.message})
    } 
};

authController.authenticate = async(req,res,next) => {
  try{
    const tokenString = req.headers.authorization;
    if(!tokenString) throw new Error("token not found");
    const token = tokenString.replace("Bearer ","");
    jwt.verify(token,JWT_SECRET_KEY,(error,payload)=>{
      if(error) throw new Error("invalid token")
      req.userId= payload._id
    })
    next()
  }catch(error){
    res.status(400).json({status:"fail", error:error.message})
  }
}


authController.checkAdminPermission = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new Error("user not found");
    if (user.role !== "admin") throw new Error("permission denied");
    next();
  } catch (error) {
    res.status(403).json({ status: "fail", error: error.message });
  }
};

module.exports = authController;
