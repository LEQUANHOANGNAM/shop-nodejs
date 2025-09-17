const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
    role: req.user && req.user.role ? req.user.role : { permissions: [] }
  });
}

module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo mới nhóm quyền",
    role: req.user && req.user.role ? req.user.role : { permissions: [] }
  });
};

module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();

  res.redirect(systemConfig.prefixAdmin+"/roles");
};

module.exports.permissions = async (req, res) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/permission", {
    pageTitle: "Phân quyền",
    records: records,
    role: req.user && req.user.role ? req.user.role : { permissions: [] }
  });
};


module.exports.permissionPatch = async (req, res) => {
  const roles = req.body;

  for (const role of roles) {
    await Role.updateOne({
      _id: role.id,
      deleted: false
    }, {
      permissions: role.permissions
    });
  }

  res.json({
    code: 200,
    message: "Cập nhật thành công!"
  });
};