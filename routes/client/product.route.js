const express = require("express");
const router = express.Router();
const productController = require("../../controllers/client/product.controller");

// Import middleware đúng


// Trang danh sách sản phẩm – yêu cầu đăng nhập
router.get("/", productController.index);

// Trang chi tiết sản phẩm – cũng yêu cầu đăng nhập
router.get("/:id",productController.detail);

module.exports = router;