module.exports = (sequelize, DataTypes) => {

const ProductTheme = sequelize.define('ProductTheme', {
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "product",
      key: 'id',
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Theme",
      key: 'category',
    },
  },
}, {
  tableName: 'productTheme',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['productId', 'category'],
    },
  ],
});

return ProductTheme;
}