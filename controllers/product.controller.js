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