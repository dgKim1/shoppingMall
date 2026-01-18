const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
