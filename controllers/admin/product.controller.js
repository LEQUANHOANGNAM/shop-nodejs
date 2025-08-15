const Products = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination");
const systemAdmin= require("../../config/system")

//[GET] admin/products
module.exports.index = async (req, res) => {
  // console.log(req.query.status);

  // đoạn bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";
  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }

  // Pagination
  const countProduct = await Products.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limit: 2,
    },
    req.query,
    countProduct
  );
  // if(req.query.page){
  //     objectPagination.currentPage= parseInt(req.query.page);
  // }

  // objectPagination.skip=(objectPagination.currentPage-1)*objectPagination.limit;

  // const countProduct= await Products.countDocuments(find);
  // console.log(countProduct)
  const totalPage = Math.ceil(countProduct / objectPagination.limit);
  // console.log(totalPage);
  objectPagination.totalPage = totalPage;

  //endPagination

  const products = await Products.find(find)
    .limit(objectPagination.limit)
    .skip(objectPagination.skip);

  // console.log(products);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang Sản Phẩm:",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: objectPagination,
  });
};
//[PATCH] admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  // console.log(req.params);
  // res.send(`${status}-${id}`);

  await Products.updateOne({ _id: id }, { status: status });

  req.flash("success", "cập nhật trạng thái thành công");
  res.redirect("back");
};
// Change Multi
module.exports.changeMulti = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(",").map((id) => id.trim());

  if (!["active", "inactive", "delete-all", "change-position"].includes(type)) {
    return res.status(400).send("Invalid action type");
  }

  try {
    switch (type) {
      case "active":
        await Products.updateMany({ _id: { $in: ids } }, { status: "active" });
        break;

      case "inactive":
        await Products.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" }
        );
        break;

      case "delete-all":
        await Products.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() }
        );
        break;

      case "change-position":
        for (const item of ids) {
          let [id, position] = item.split("-");
          position = parseInt(position);
          // console.log("👉 Updating:", { id, position });
          await Products.updateOne({ _id: id }, { position: position });
        }
        break;

      default:
        break;
    }

    res.redirect("back");
  } catch (error) {
    console.error("❌ Lỗi changeMulti:", error);
    res.status(500).send("Error while updating records");
  }
};

//[DELETE] admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    // Cập nhật trạng thái delete của sản phẩm
    await Products.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() }
    );

    // Chuyển hướng đến trang trước hoặc trang chủ nếu không có referrer
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    console.error("Error deleting item:", error);
    // Xử lý lỗi và chuyển hướng người dùng
    res.status(500).send("An error occurred while deleting the item.");
  }
};


// [GET] admin/product/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Trang thêm mới",
  });
};


// [POST] admin/product/create
module.exports.createPost = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
      const count = await Products.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const product = new Products(req.body);
    await product.save();

    res.redirect(`${systemAdmin.prefixAdmin}/products`);
  } catch (err) {
    console.error("Lỗi tạo sản phẩm:", err);
    res.status(500).send("Đã xảy ra lỗi khi tạo sản phẩm.");
  }
};
