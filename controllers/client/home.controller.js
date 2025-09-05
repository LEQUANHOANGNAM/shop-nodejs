const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    // Lấy 6 sản phẩm mới nhất (status = active, chưa bị xóa)
    const products = await Product.find({
      status: "active",
      deleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(6);

    // Thêm trường priceNew vào từng product
    const updatedProducts = products.map((item) => {
      const priceNew = (
        item.price *
        (100 - (item.discountPercentage || 0)) /
        100
      ).toFixed(0);
      return { ...item.toObject(), priceNew };
    });

    res.render("client/pages/home/index", {
      pageTitle: "Trang Chủ",
      products: updatedProducts,
    });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Có lỗi xảy ra khi tải trang chủ");
  }
};
