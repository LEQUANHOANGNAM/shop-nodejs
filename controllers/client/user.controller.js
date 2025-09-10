const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper");
const User = require("../../models/user.model");

// [GET] /user/register
module.exports.register = async (req, res) => {
  try {
    // Nếu đã đăng nhập thì quay về trang chủ
    if (req.cookies.tokenUser) {
      return res.redirect("/");
    }

    res.render("client/pages/user/register", {
      pageTitle: "Đăng ký tài khoản",
    });
  } catch (error) {
    console.error("Register page error:", error);
    res.status(500).send("Có lỗi xảy ra khi tải trang đăng ký");
  }
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  try {
    const existUser = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (existUser) {
      req.flash("error", "Email đã tồn tại!");
      return res.redirect("back");
    }

    const userData = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: md5(req.body.password),
      tokenUser: generateHelper.generateRandomString(30),
      statusOnline: "online",
    };

    const user = new User(userData);
    await user.save();

    res.cookie("tokenUser", user.tokenUser, { httpOnly: true });

    req.flash("success", "Đăng ký tài khoản thành công!");
    res.redirect("/");
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send("Có lỗi xảy ra khi đăng ký");
  }
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  try {
    // Nếu đã login thì về trang chủ
    if (req.cookies.tokenUser) {
      const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
      });

      if (user) {
        return res.redirect("/");
      } else {
        res.clearCookie("tokenUser"); // xoá cookie cũ nếu không hợp lệ
      }
    }

    res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập tài khoản",
    });
  } catch (error) {
    console.error("Login page error:", error);
    res.status(500).send("Có lỗi xảy ra khi tải trang đăng nhập");
  }
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (!user) {
      req.flash("error", "Email không tồn tại!");
      return res.redirect("back");
    }

    if (md5(req.body.password) !== user.password) {
      req.flash("error", "Sai mật khẩu!");
      return res.redirect("back");
    }

    if (user.status !== "active") {
      req.flash("error", "Tài khoản đang bị khóa!");
      return res.redirect("back");
    }

    res.cookie("tokenUser", user.tokenUser, { httpOnly: true });

    await User.updateOne(
      { email: req.body.email, deleted: false },
      { statusOnline: "online" }
    );

    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Có lỗi xảy ra khi đăng nhập");
  }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
     try {
    await User.updateOne({
      _id: res.locals.user.id
    }, {
      statusOnline: "offline"
    });
  } catch(e) {
    console.log(e);
  }

  res.clearCookie("tokenUser");
  res.redirect("/user/login");
};
