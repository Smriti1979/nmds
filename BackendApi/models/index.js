/** @format */

require("dotenv").config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_DAILECT, DB_PORT } =
  process.env;
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: decodeURIComponent(DB_PASSWORD),
  database: DB_DATABASE,
  dialect: DB_DAILECT,
  port: DB_PORT,
});

//checking if connection is done
sequelize
  .authenticate()
  .then(() => {})
  .catch((err) => {});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize = sequelize;

//connecting to model
db.users = require("./userModel")(sequelize, DataTypes);
db.log = require("./logModel")(sequelize, DataTypes);

db.AdminUser = require("./admin/AdminUsers")(sequelize, DataTypes);
db.metadata = require("./admin/meta")(sequelize, DataTypes);
db.product = require("./admin/product")(sequelize, DataTypes);
db.producttheme = require("./admin/producttheme")(sequelize, DataTypes);
db.theme = require("./admin/theme")(sequelize, DataTypes);

//exporting the module
module.exports = db;
