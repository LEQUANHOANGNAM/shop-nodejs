const systemConfig=require("../../config/system")
const dashboardRoutes = require("./dashboard.route")
const productRoutes = require("./product.router")

module.exports = (app) => {
    const PATH_ADMIN=systemConfig.prefixAdmin;

    app.use(PATH_ADMIN+"/dashboard", dashboardRoutes);

    app.use(PATH_ADMIN+"/products", productRoutes);
}









