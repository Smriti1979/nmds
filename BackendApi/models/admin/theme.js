
module.exports = (sequelize, DataTypes) => {
const Theme = sequelize.define('Theme', {
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Theme',
  timestamps: false,
});
return Theme
}