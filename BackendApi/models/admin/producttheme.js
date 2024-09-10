/** @format */

module.exports = (sequelize, DataTypes) => {
  const producttheme = sequelize.define(
    "productTheme",
    {
      productId: {
        type: DataTypes.TEXT, 
        allowNull: false,
        references: {
          model: "product",
          key: "id",
        },
      },
      category: {
        type: DataTypes.TEXT, 
        allowNull: false,
        references: {
          model: "theme",
          key: "category",
        },
      },
    },
    {
      tableName: "producttheme",
      timestamps: false,
      freezeTableName: true,
      indexes: [
        {
          unique: true,
          fields: ["productId", "category"],
        },
      ],
    }
  );

  return producttheme;
};
