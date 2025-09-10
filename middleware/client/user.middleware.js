// middleware/client/user.middleware.js

const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if (!req.cookies.tokenUser) {
      return res.redirect("/user/login");
    }

    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    });

    if (!user) {
      // Cookie không hợp lệ thì xoá cookie và về trang login
      res.clearCookie("tokenUser");
      return res.redirect("/user/login");
    }

    // Lưu user vào res.locals cho pug
    res.locals.user = user;
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
  }
};
