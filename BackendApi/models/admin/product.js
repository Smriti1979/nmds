/** @format */

module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define(
    "product",
    {
      id: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      count: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      period: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tooltip: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      table: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      swagger: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      viz: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "adminusers",
          key: "id",
        },
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
