const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: [String], required: true },
    price: { type: Number, required: true },
    sales: { type: Number, default: 0 },
    description: { type: String, required: true },
    categoryMain: {
      type: String,
      enum: ["의류", "신발", "액세서리"],
      required: true,
    },
    categorySub: {
      type: String,
      enum: [
        "아우터",
        "상의",
        "하의",
        "트레이닝",
        "스니커즈",
        "러닝",
        "농구",
        "슬리퍼",
        "모자",
        "가방",
        "양말",
        "장갑",
      ],
      required: true,
    },
    gender: {
      type: String,
      enum: ["남성", "여성", "남녀공용"],
    },
    personType: {
      type: String,
      enum: ["Men", "Women", "Kid"],
    },
    brand: { type: String },
    color: {
      type: [String],
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
      required: true,
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
