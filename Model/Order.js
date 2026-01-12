const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "preparing" },
    orderId: { type: String, required: true, unique: true },
    totalPrice: { type: Number, required: true, default: 0 },
    shipTo: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

orderSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
