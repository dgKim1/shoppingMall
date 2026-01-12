const express = require('express')
const router = express.Router()
const authController = require("../controllers/auth.controller")
const userController = require("../controllers/user.controller")

//회원가입
router.post("/login", authController.loginWithEmail);
router.post("/google", userController.loginWithGoogle);

module.exports= router;
