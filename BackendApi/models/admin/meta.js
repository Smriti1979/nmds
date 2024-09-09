/** @format */

module.exports = (sequelize, DataTypes) => {
  const metadata = sequelize.define(
    "metadata",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Product: {
        type: DataTypes.STRING(60),
        allowNull: false,
        references: {
          model: "product",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      Category: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      Geography: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      Frequency: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      TimePeriod: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      DataSource: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING(800),
        allowNull: false,
      },
      lastUpdateDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      FutureRelease: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      BasePeriod: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      Keystatistics: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      NMDS: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      nmdslink: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      tableName: "metadata",
      timestamps: false,
      freezeTableName: true,
    }
  );

  metadata.associate = (models) => {
    metadata.belongsTo(models.product, {
      foreignKey: "product",
      targetKey: "id",
      constraints: true,
    });
  };

  return metadata;
};
