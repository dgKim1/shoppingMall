const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const cartController = require("../controllers/cart.controller");

router.post("/", authController.authenticate, cartController.addToCart);
router.get("/", authController.authenticate, cartController.getCart);
router.patch("/item/:id", authController.authenticate, cartController.updateCartItemQuantity);
router.delete("/item/:id", authController.authenticate, cartController.removeCartItemById);
router.delete("/item", authController.authenticate, cartController.removeCartItemByProduct);
router.delete("/", authController.authenticate, cartController.clearCart);

module.exports = router;
