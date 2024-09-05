module.exports = (sequelize, DataTypes) => {
const Product = sequelize.define('product', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  count: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tooltip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tables: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  swagger: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  viz: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'product',
  timestamps: false,
});

return Product;
}