
module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('role', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      canCreate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      canUpdate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      canGrantPermissions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    });
  
    role.associate = (models) => {
      role.belongsToMany(models.pimdUsers, {
        through: 'userroles', // Name of the junction table
        foreignKey: 'roleId',
        as: 'users', // Alias for the association
      });
    };
  
    return role;
  };
  