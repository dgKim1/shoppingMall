const Product = require("../Model/Product");
const ProductStock = require("../Model/ProductStock");
const productController = {};

productController.createProduct = async (req, res) => {
  try {
    let {
      sku,
      name,
      image,
      price,
      description,
      categoryMain,
      categorySub,
      status,
      isDeleted,
    } = req.body;
    if (image && !Array.isArray(image)) {
      image = [image];
    }
    const newProduct = new Product({
      sku,
      name,
      image,
      price,
      description,
      categoryMain,
      categorySub,
      status,
      isDeleted,
    });
    await newProduct.save();
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};


productController.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, sort, categoryMain, categorySub } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const skip = (pageNum - 1) * limitNum;
    let sortOption = null;
    switch (sort) {
      case "신상품":
        sortOption = { createdAt: -1 };
        break;
      case "가격 낮은순":
        sortOption = { price: 1 };
        break;
      case "가격 높은순":
        sortOption = { price: -1 };
        break;
      case "추천순":
        sortOption = { sales: -1 };
        break;
      default:
        sortOption = null;
        break;
    }

    const filter = {};
    if (categoryMain) {
      filter.categoryMain = categoryMain;
    }
    if (categorySub) {
      filter.categorySub = categorySub;
    }
    const productQuery = Product.find(filter).skip(skip).limit(limitNum);
    if (sortOption) {
      productQuery.sort(sortOption);
    }
    const [products, total] = await Promise.all([
      productQuery,
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      data: products,
      total,
      totalPages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};


productController.getProductsBySearch = async (req, res) => {
  try {
    const { name = "", page = 1, limit = 12, sort } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const skip = (pageNum - 1) * limitNum;
    let sortOption = null;
    switch (sort) {
      case "신상품":
        sortOption = { createdAt: -1 };
        break;
      case "가격 낮은순":
        sortOption = { price: 1 };
        break;
      case "가격 높은순":
        sortOption = { price: -1 };
        break;
      case "추천순":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = null;
        break;
    }
    const productQuery = Product.find(filter).skip(skip).limit(limitNum);
    if (sortOption) {
      productQuery.sort(sortOption);
    }
    const [products, total] = await Promise.all([
      productQuery,
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      data: products,
      total,
      totalPages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.image && !Array.isArray(update.image)) {
      update.image = [update.image];
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      throw new Error("product not found");
    }
    return res.status(200).json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProductBySku = async (req, res) => {
  try {
    const { sku } = req.params;
    if (!sku) {
      throw new Error("sku is required");
    }
    const product = await Product.findOne({ sku });
    if (!product) {
      throw new Error("product not found");
    }
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.checkAndDecreaseStock = async (productId, size, quantity) => {
    const qty = Math.max(parseInt(quantity, 10) || 1, 1);
    const stock = await ProductStock.findOneAndUpdate(
        { productId, size, quantity: { $gte: qty } },
        { $inc: { quantity: -qty } },
        { new: true }
    );
    if (!stock) {
        throw new Error("insufficient stock");
    }
    return stock;
};


module.exports = productController;
