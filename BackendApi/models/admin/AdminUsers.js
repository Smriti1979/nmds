module.exports = (sequelize, DataTypes) => {
  const AdminUsers = sequelize.define(
    "adminUsers",
    {
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
      emailid: {
        type: DataTypes.STRING,
      },
      phno: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: `adminusers`,
      timestamps: false,
      freezeTableName: true,
    }
  );
  return AdminUsers;
};
