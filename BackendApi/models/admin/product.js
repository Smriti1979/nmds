/** @format */

module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.STRING(20), 
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      count: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING(100000), 
        allowNull: false,
      },
      period: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      tooltip: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      tables: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      swagger: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      viz: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
    },
    {
      tableName: "product",
      timestamps: false,
      freezeTableName: true,
    }
  );

  return product;
};
