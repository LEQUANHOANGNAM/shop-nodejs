const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const usersRoutes = require("./user.route");
const searchRoutes= require("./search.route")

const { requireAuth } = require("../../middleware/client/user.middleware");

function route(app) {
  
  app.use("/user", usersRoutes);

  app.use("/search",requireAuth, searchRoutes)

  app.use("/", homeRoutes);
  app.use("/products", requireAuth, productRoutes);
}

module.exports = route;
