module.exports = (sequelize, DataTypes) => {

const MetaData = sequelize.define('MetaData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "product",
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  geography: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timePeriod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataSource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastUpdateDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  futureRelease: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  basePeriod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  keystatistics: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NMDS: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nmdslink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'MetaData',
  timestamps: false,
});
MetaData.associate = (models) => {
  MetaData.belongsTo(models.Product, { foreignKey: 'product', targetKey: 'id' });
};


return  MetaData;
}