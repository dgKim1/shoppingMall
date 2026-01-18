const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {
  APPAREL_SIZES,
  ACCESSORY_SIZES,
  SHOE_SIZES,
} = require("../utils/sizeRules");

const productStockSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  size: {
    type: String,
    enum: [...APPAREL_SIZES, ...ACCESSORY_SIZES, ...SHOE_SIZES],
    required: true,
  },
  quantity: { type: Number, required: true },
});

const ProductStock = mongoose.model("ProductStock", productStockSchema);
module.exports = ProductStock;
