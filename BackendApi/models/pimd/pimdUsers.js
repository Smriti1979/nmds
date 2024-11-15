module.exports = (sequelize, DataTypes) => {
  const pimdUsers = sequelize.define(
    "pimdUsers",
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phno: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.TEXT,
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: `pimdusers`,
      timestamps: false,
      freezeTableName: true,
    }
  );

  pimdUsers.associate = (models) => {
    pimdUsers.belongsToMany(models.role, {
      through: 'userroles', // Name of the junction table
      foreignKey: 'userId',
      as: 'roles', // Alias for the association
    });
  };
  
  return pimdUsers;
};
