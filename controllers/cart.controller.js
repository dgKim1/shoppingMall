const cartService = require("../services/cart.service");

const cartController = {};

cartController.addToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, color, quantity } = req.body;
    const cartItem = await cartService.addToCart(userId, productId, size, color, quantity);
    return res.status(200).json({ status: "success", data: cartItem });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const items = await cartService.getCart(req.userId);
    return res.status(200).json({ status: "success", data: items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.removeCartItemById = async (req, res) => {
  try {
    const deletedItem = await cartService.removeCartItemById(req.userId, req.params.id);
    return res.status(200).json({ status: "success", data: deletedItem });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.removeCartItemByProduct = async (req, res) => {
  try {
    const { productId, size, color } = req.body;
    const deletedItem = await cartService.removeCartItemByProduct(req.userId, productId, size, color);
    return res.status(200).json({ status: "success", data: deletedItem });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.updateCartItemQuantity = async (req, res) => {
  try {
    const cartItem = await cartService.updateCartItemQuantity(req.userId, req.params.id, req.body.quantity);
    return res.status(200).json({ status: "success", data: cartItem });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.clearCart = async (req, res) => {
  try {
    await cartService.clearCart(req.userId);
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
