const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const usersRoutes = require("./user.route");

function route(app) {
  app.use("/", homeRoutes);         
  app.use("/products", productRoutes); 
  app.use("/user", usersRoutes); 
}

module.exports = route;
