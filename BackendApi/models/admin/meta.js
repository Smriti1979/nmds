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
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        references: {
          model: "product",
          key: "id",
        },
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Category: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Geography: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Frequency: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      TimePeriod: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      DataSource: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lastUpdateDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      FutureRelease: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      BasePeriod: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      Keystatistics: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      NMDS: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nmdslink: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull:true
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
