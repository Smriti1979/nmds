module.exports = (sequelize, DataTypes) => {
  const metadata = sequelize.define(
    "metadata",
    {
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      id: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
      },
      productid: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      productname: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      agencyid: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      icon: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      swagger: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "metadata",
      timestamps: false,
      freezeTableName: true,
    }
  );

  metadata.associate = (models) => {
    metadata.belongsTo(models.agency, {
      foreignKey: "agencyid",
      targetKey: "agencyid",
      constraints: true,
    });
  };

  return metadata;
};
