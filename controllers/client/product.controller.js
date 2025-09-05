const Product = require("../../models/product.model");

module.exports = {
  index: async (req, res) => {
    try {
      const products = await Product.find({
        status: "active",
        deleted: false,
      });

      const updatedProducts = products.map((item) => {
        const priceNew = (
          item.price * (100 - (item.discountPercentage || 0)) / 100
        ).toFixed(0);
        return { ...item.toObject(), priceNew };
      });

      res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: updatedProducts,
      });
    } catch (error) {
      console.error("Error loading products:", error);
      res.status(500).send("Có lỗi xảy ra khi tải danh sách sản phẩm");
    }
  },

  detail: async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        status: "active",
        deleted: false
      });

      if (!product) {
        return res.redirect("/products");
      }

      product.priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);

      res.render("client/pages/products/detail", {
        pageTitle: product.title,
        product: product
      });
    } catch (error) {
      console.log(error);
      res.redirect("/products");
    }
  }
};
