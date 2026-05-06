const Wishlist = require("../model/Wishlist");
const Product = require("../model/Product");

const wishlistService = {};

wishlistService.addToWishlist = async (userId, productId) => {
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
    return wishlist;
  }

  const exists = wishlist.items.some((id) => id.toString() === productId.toString());
  if (!exists) {
    wishlist.items.push(productId);
    await wishlist.save();
  }
  return wishlist;
};

wishlistService.getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ userId }).populate("items");
  if (!wishlist) {
    return [];
  }
  return wishlist.items;
};

wishlistService.removeFromWishlist = async (userId, productId) => {
  if (!productId) {
    throw new Error("productId is required");
  }
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return [];
  }
  wishlist.items = wishlist.items.filter((id) => id.toString() !== productId.toString());
  await wishlist.save();
  return wishlist.items;
};

module.exports = wishlistService;
