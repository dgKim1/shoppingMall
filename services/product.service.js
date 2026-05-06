const Product = require("../model/Product");
const ProductStock = require("../model/ProductStock");
const { isSizeAllowed, normalizeSize } = require("../utils/sizeRules");

const productService = {};

productService.createProduct = async (data) => {
  let { sku, name, image, price, description, categoryMain, categorySub, color, status, isDeleted, stocks = [] } = data;

  if (image && !Array.isArray(image)) {
    image = [image];
  }
  if (color && !Array.isArray(color)) {
    color = [color];
  }
  if (!color || color.length === 0) {
    throw new Error("color is required");
  }

  const product = new Product({ sku, name, image, price, description, categoryMain, categorySub, color, status, isDeleted });
  await product.save();

  if (Array.isArray(stocks) && stocks.length > 0) {
    const stockDocs = stocks.map((stock) => {
      const normalizedSize = normalizeSize(stock.size);
      if (!isSizeAllowed(categoryMain, normalizedSize)) {
        throw new Error("invalid size for category");
      }
      const stockColor = stock.color || (Array.isArray(color) && color.length === 1 ? color[0] : null);
      if (!stockColor) {
        throw new Error("color is required for stock");
      }
      return {
        productId: product._id,
        size: normalizedSize,
        color: stockColor,
        quantity: Math.max(parseInt(stock.quantity, 10) || 0, 0),
      };
    });
    await ProductStock.insertMany(stockDocs);
  }
};

productService.getAllProducts = async ({ page = 1, limit = 12, sort, categoryMain, categorySub, personType }) => {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const sortMap = {
    "신상품": { createdAt: -1 },
    "가격 낮은순": { price: 1 },
    "가격 높은순": { price: -1 },
    "추천순": { sales: -1 },
  };
  const sortOption = sortMap[sort] || null;

  const filter = {};
  if (categoryMain) filter.categoryMain = categoryMain;
  if (categorySub) filter.categorySub = categorySub;
  if (personType) filter.personType = personType;

  const query = Product.find(filter).skip(skip).limit(limitNum);
  if (sortOption) query.sort(sortOption);

  const [products, total] = await Promise.all([query, Product.countDocuments(filter)]);
  return { products, total, totalPages: Math.ceil(total / limitNum), page: pageNum };
};

productService.getProductsBySearch = async ({ name = "", page = 1, limit = 12, sort }) => {
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const sortMap = {
    "신상품": { createdAt: -1 },
    "가격 낮은순": { price: 1 },
    "가격 높은순": { price: -1 },
    "추천순": { createdAt: -1 },
  };
  const sortOption = sortMap[sort] || null;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: "i" };

  const query = Product.find(filter).skip(skip).limit(limitNum);
  if (sortOption) query.sort(sortOption);

  const [products, total] = await Promise.all([query, Product.countDocuments(filter)]);
  return { products, total, totalPages: Math.ceil(total / limitNum), page: pageNum };
};

productService.updateProductById = async (id, update) => {
  if (update.image && !Array.isArray(update.image)) {
    update.image = [update.image];
  }
  const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!product) {
    throw new Error("product not found");
  }
  return product;
};

productService.getProductBySku = async (sku) => {
  if (!sku) {
    throw new Error("sku is required");
  }
  const product = await Product.findOne({ sku });
  if (!product) {
    throw new Error("product not found");
  }
  return product;
};

productService.checkAndDecreaseStock = async (productId, size, color, quantity) => {
  const qty = Math.max(parseInt(quantity, 10) || 1, 1);
  const stock = await ProductStock.findOneAndUpdate(
    { productId, size, color, quantity: { $gte: qty } },
    { $inc: { quantity: -qty } },
    { new: true }
  );
  if (!stock) {
    throw new Error("insufficient stock");
  }
  const hasStock = await ProductStock.exists({ productId, quantity: { $gt: 0 } });
  if (!hasStock) {
    await Product.findByIdAndUpdate(productId, { status: "품절" });
  }
  return stock;
};

module.exports = productService;
