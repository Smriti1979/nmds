module.exports = (sequelize, DataTypes) => {
  const agency = sequelize.define(
    "agency",
    {
      agencyid: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      agency_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "agency",
      timestamps: false,
      freezeTableName: true,
    }
  );

  agency.associate = (models) => {
    agency.belongsTo(models.agency, {
      foreignKey: "agencyid",
      targetKey: "agencyid",
      constraints: true,
    });
  };

  return agency;
};
