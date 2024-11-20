module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
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
      agencyid: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      newuser:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      email: {
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
      tableName: "pimdUsers",
      timestamps: false,
      freezeTableName: true,
    }
  );

  users.associate = (models) => {
    users.belongsToMany(models.role, {
      through: "userroles",
      foreignKey: "userId",
      as: "roles",
    });
  };
  
  return users;
};
