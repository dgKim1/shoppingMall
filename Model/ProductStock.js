const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productStockSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const ProductStock = mongoose.model("ProductStock", productStockSchema);
module.exports = ProductStock;
