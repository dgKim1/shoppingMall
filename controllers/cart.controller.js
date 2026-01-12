const Cart = require("../Model/Cart");
const CartItem = require("../Model/CartItem");
const Product = require("../Model/Product");

const cartController = {};

cartController.addToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, quantity = 1 } = req.body;

    if (!productId || !size) {
      throw new Error("productId and size are required");
    }

    const qty = Math.max(parseInt(quantity, 10) || 1, 1);

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("product not found");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne({
      cartId: cart._id,
      productId,
      size,
    });

    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart._id,
        productId,
        size,
        quantity: qty,
      });
    }

    return res.status(200).json({ status: "success", data: cartItem });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
