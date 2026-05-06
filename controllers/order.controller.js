const orderService = require("../services/order.service");

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.userId, req.body.shipTo);
    return res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderHistory = async (req, res) => {
  try {
    const data = await orderService.getOrderHistory(req.userId);
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
