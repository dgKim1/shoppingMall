const Product = require("../Model/Product");
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


productController.getAllProducts = async(req,res)=>{
    try{
        const allProducts = await Product.find({});
        return res.status(200).json({
            status: "success", data: allProducts
        })

    }catch(error){
    res.status(400).json({status:"fail",error:error.message})
}

}


productController.getProductsBySearch = async(req,res)=>{
    try{
        const { name = "", page = 1 } = req.query;
        const limit = 5;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }

        const skip = (pageNum - 1) * limit;
        const [productList, total] = await Promise.all([
            productList.find(filter).skip(skip).limit(limit),
            productList.countDocuments(filter),
        ]);

        return res.status(200).json({
            status: "success",
            data: products,
            total,
            totalPages: Math.ceil(total / limit),
            page: pageNum,
        });
    }catch(error){
        res.status(400).json({status:"fail",error:error.message})
    }
}

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


module.exports = productController;
