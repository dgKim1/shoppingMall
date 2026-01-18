const Order = require("../Model/Order");
const crypto = require("crypto");
const OrderItem = require("../Model/OrderItem");
const Cart = require("../Model/Cart");
const CartItem = require("../Model/CartItem");
const Product = require("../Model/Product");
const productController = require("./product.controller");

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { shipTo } = req.body;

    if (!shipTo) {
      throw new Error("shipTo is required");
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("cart not found");
    }

    const cartItems = await CartItem.find({ cartId: cart._id });
    if (cartItems.length == 0) {
      throw new Error("cart is empty");
    }

    const orderItemsData = [];
    let totalPrice = 0;

    const results = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error("product not found");
        }

        await productController.checkAndDecreaseStock(
          item.productId,
          item.size,
          item.color,
          item.quantity
        );

        return {
          item,
          product,
        };
      })
    );

    for (const { item, product } of results) {
      orderItemsData.push({
        productId: item.productId,
        productName: product.name,
        size: item.size,
        color: item.color,
        price: product.price,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;
    }

    const orderId = `OD${crypto.randomBytes(4).toString("hex")}${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const order = await Order.create({
      userId,
      orderId,
      totalPrice,
      shipTo,
    });

    const orderItemsWithOrderId = orderItemsData.map((item) => ({
      ...item,
      orderId: order._id,
    }));

    await OrderItem.insertMany(orderItemsWithOrderId);
    await CartItem.deleteMany({ cartId: cart._id });

    return res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
