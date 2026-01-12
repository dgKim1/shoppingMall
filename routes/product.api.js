const express = require("express")
const authController = require("../controllers/auth.controller.js")
const productController = require("../controllers/product.controller.js")
const router = express.Router()
router.post("/createProdcut",authController.authenticate,
    authController.checkAdminPermission,
    productController.createProduct);

router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductsBySearch", productController.getProductsBySearch);
router.put("/updateProductById/:id", authController.authenticate, authController.checkAdminPermission, productController.updateProductById);


module.exports = router;
