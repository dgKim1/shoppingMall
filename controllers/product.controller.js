const Product = require("../Model/Product");
const ProductStock = require("../Model/ProductStock");
const productController = {};

productController.createProduct = async(req,res)=>{
    try{
    let {sku, name, image,price,description,category,status,isDeleted} = req.body;
    const newProduct = new Product(
        {sku,
    name,
    image,
    price,
    description,
    category,
    status,
    isDeleted
        }
    )
    await newProduct.save();
    return res.status(200).json({ status: "success" });
}catch(error){
    res.status(400).json({status:"fail",error:error.message})
}
}


productController.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments({}),
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
    const { name = "", page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const skip = (pageNum - 1) * limitNum;
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
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
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            throw new Error("product not found");
        }
        return res.status(200).json({ status: "success", data: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: "fail", error: error.message });
    }
}

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
