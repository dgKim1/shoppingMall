const wishlistService = require("../services/wishlist.service");

const wishlistController = {};

wishlistController.addToWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.addToWishlist(req.userId, req.body.productId);
    return res.status(200).json({ status: "success", data: wishlist });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

wishlistController.getWishlist = async (req, res) => {
  try {
    const items = await wishlistService.getWishlist(req.userId);
    return res.status(200).json({ status: "success", data: items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

wishlistController.removeFromWishlist = async (req, res) => {
  try {
    const items = await wishlistService.removeFromWishlist(req.userId, req.body.productId);
    return res.status(200).json({ status: "success", data: items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = wishlistController;
