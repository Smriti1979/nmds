require("dotenv").config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASETPM, DB_DAILECT, DB_PORT } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASETPM,
  dialect: DB_DAILECT,
  port: DB_PORT,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful.");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./pimd/users")(sequelize, DataTypes);
db.metadata = require("./pimd/metadata")(sequelize, DataTypes);
db.agency = require("./pimd/agency")(sequelize, DataTypes);
db.role = require("./pimd/role")(sequelize, DataTypes);
db.userroles = require("./pimd/userroles")(sequelize, DataTypes);

// Associations
db.metadata.associate(db);
db.users.associate(db);

module.exports = db;
