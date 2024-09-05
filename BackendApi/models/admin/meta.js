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
      product: {
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
      category: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      geography: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      frequency: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      timePeriod: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      dataSource: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(800),
        allowNull: false,
      },
      lastUpdateDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      futureRelease: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      basePeriod: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      keystatistics: {
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
