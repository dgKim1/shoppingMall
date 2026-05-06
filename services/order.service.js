const crypto = require("crypto");
const Order = require("../model/Order");
const OrderItem = require("../model/OrderItem");
const Cart = require("../model/Cart");
const CartItem = require("../model/CartItem");
const Product = require("../model/Product");
const productService = require("./product.service");

const orderService = {};

orderService.createOrder = async (userId, shipTo) => {
  if (!shipTo) {
    throw new Error("shipTo is required");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("cart not found");
  }

  const cartItems = await CartItem.find({ cartId: cart._id });
  if (cartItems.length === 0) {
    throw new Error("cart is empty");
  }

  const results = await Promise.all(
    cartItems.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error("product not found");
      }
      await productService.checkAndDecreaseStock(item.productId, item.size, item.color, item.quantity);
      return { item, product };
    })
  );

  let totalPrice = 0;
  const orderItemsData = results.map(({ item, product }) => {
    totalPrice += product.price * item.quantity;
    return {
      productId: item.productId,
      productName: product.name,
      size: item.size,
      color: item.color,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const orderId = `OD${crypto.randomBytes(4).toString("hex")}${Math.floor(1000 + Math.random() * 9000)}`;
  const order = await Order.create({ userId, orderId, totalPrice, shipTo });

  await OrderItem.insertMany(orderItemsData.map((item) => ({ ...item, orderId: order._id })));
  await CartItem.deleteMany({ cartId: cart._id });

  return order;
};

orderService.getOrderHistory = async (userId) => {
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((order) => order._id);
  const orderItems = await OrderItem.find({ orderId: { $in: orderIds } }).sort({ _id: 1 }).lean();

  const itemsByOrderId = new Map();
  for (const item of orderItems) {
    const key = item.orderId.toString();
    const list = itemsByOrderId.get(key);
    if (list) {
      list.push(item);
    } else {
      itemsByOrderId.set(key, [item]);
    }
  }

  return orders.map((order) => {
    const obj = { ...order };
    delete obj.__v;
    const items = (itemsByOrderId.get(order._id.toString()) || []).map((item) => {
      const i = { ...item };
      delete i.__v;
      return i;
    });
    return { ...obj, items };
  });
};

module.exports = orderService;
