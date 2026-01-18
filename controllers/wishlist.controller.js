const Wishlist = require("../Model/Wishlist");
const Product = require("../Model/Product");

const wishlistController = {};

wishlistController.addToWishlist = async (req, res) => {
  try {
    const { userId } = req;
    const { productId } = req.body;
    if (!productId) {
      throw new Error("productId is required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("product not found");
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, items: [productId] });
      return res.status(200).json({ status: "success", data: wishlist });
    }

    const exists = wishlist.items.some(
      (id) => id.toString() === productId.toString()
    );
    if (!exists) {
      wishlist.items.push(productId);
      await wishlist.save();
    }

    return res.status(200).json({ status: "success", data: wishlist });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

wishlistController.getWishlist = async (req, res) => {
  try {
    const { userId } = req;
    const wishlist = await Wishlist.findOne({ userId }).populate("items");
    if (!wishlist) {
      return res.status(200).json({ status: "success", data: [] });
    }
    return res.status(200).json({ status: "success", data: wishlist.items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

wishlistController.removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req;
    const { productId } = req.body;
    if (!productId) {
      throw new Error("productId is required");
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(200).json({ status: "success", data: [] });
    }

    wishlist.items = wishlist.items.filter(
      (id) => id.toString() !== productId.toString()
    );
    await wishlist.save();

    return res.status(200).json({ status: "success", data: wishlist.items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = wishlistController;
