/** @format */

module.exports = (sequelize, DataTypes) => {
  const theme = sequelize.define(
    "theme",
    {
      category: {
        type: DataTypes.STRING(20), 
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(40), 
        allowNull: false,
      },
    },
    {
      tableName: "theme",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return theme;
};
