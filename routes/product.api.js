const express = express()
const authController = require("../controllers/auth.controller.js")
const productController = require("../controllers/product.controller.js")
const router = express.Router()
router.post("/createProdcut",authController.authenticate,
    authController.checkAdminPermission,
    productController.createProduct);

module.exports = router;