/** @format */

module.exports = (sequelize, DataTypes) => {
  const productagency = sequelize.define(
    "productagency",
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
          model: "agency",
          key: "category",
        },
      },
    },
    {
      tableName: "productagency",
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

  return productagency;
};
