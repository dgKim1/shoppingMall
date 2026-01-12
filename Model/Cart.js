const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  },
  { timestamps: true }
);

cartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
