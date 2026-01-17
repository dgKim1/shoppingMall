const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const wishlistController = require("../controllers/wishlist.controller");

router.post("/", authController.authenticate, wishlistController.addToWishlist);
router.get("/", authController.authenticate, wishlistController.getWishlist);
router.delete("/", authController.authenticate, wishlistController.removeFromWishlist);

module.exports = router;
