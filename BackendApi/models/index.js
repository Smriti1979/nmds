/** @format */

require("dotenv").config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASETPM, DB_DAILECT, DB_PORT } =
  process.env;
const { Sequelize, DataTypes } = require("sequelize");

//Database connection with dialect of postgres specifying the database we are using
//port for my database is 5433
const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASETPM,
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
// db.sequelize = sequelize;


db.pimdUser = require("./pimd/pimdUsers")(sequelize, DataTypes);
db.metadata = require("./pimd/meta")(sequelize, DataTypes);
db.product = require("./pimd/product")(sequelize, DataTypes);
db.productagency = require("./pimd/productagency")(sequelize, DataTypes);
db.agency= require("./pimd/agency")(sequelize, DataTypes);
db.userroles = require("./pimd/userroles")(sequelize, DataTypes); 
db.role = require("./pimd/role")(sequelize, DataTypes); 


//exporting the module
module.exports = db;
