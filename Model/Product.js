const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: Array, required: true },
    gender: {
      type: String,
      enum: ["남성", "여성", "남녀공용"],
    },
    brand: { type: String },
    color: {
      type: String,
      enum: [
        "bg-black",
        "bg-white",
        "bg-red-500",
        "bg-emerald-500",
        "bg-sky-500",
        "bg-amber-500",
        "bg-slate-400",
        "bg-lime-500",
      ],
    },
    status: { type: String, default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  return obj;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
