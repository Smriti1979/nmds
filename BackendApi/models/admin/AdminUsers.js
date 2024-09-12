module.exports = (sequelize, DataTypes) => {
  const AdminUsers = sequelize.define('adminUsers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    tableName: `adminusers`,
    timestamps: false,
    freezeTableName: true
  });
  return AdminUsers;
}
