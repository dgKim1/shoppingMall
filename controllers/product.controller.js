const productService = require("../services/product.service");

const productController = {};

productController.createProduct = async (req, res) => {
  try {
    await productService.createProduct(req.body);
    return res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    return res.status(200).json({ status: "success", ...result });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProductsBySearch = async (req, res) => {
  try {
    const result = await productService.getProductsBySearch(req.query);
    return res.status(200).json({ status: "success", ...result });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.updateProductById = async (req, res) => {
  try {
    const product = await productService.updateProductById(req.params.id, { ...req.body });
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProductBySku = async (req, res) => {
  try {
    const product = await productService.getProductBySku(req.params.sku);
    return res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = productController;
