/** @format */

module.exports = (sequelize, DataTypes) => {
  const metadata = sequelize.define(
    "metadata",
    {
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Product: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "product",
          key: "id",
        },
      },
      data:{
        type: DataTypes.JSON,
        allowNull: false,
      },
      status:{
        type:DataTypes.BOOLEAN,
        defaultValue: true,
      },
      user_id:{
      type: DataTypes.INTEGER,
      references: {
        model: "adminusers",
        key: "id",
      },
      },
      latest:{
        type:DataTypes.BOOLEAN,
        allowNull:false
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
