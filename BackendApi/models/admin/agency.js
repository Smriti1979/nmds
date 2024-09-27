/** @format */

module.exports = (sequelize, DataTypes) => {
  const agency = sequelize.define(
    "agency",
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
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
    },
    {
      tableName: "agency",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return agency;
};
