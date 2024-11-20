module.exports = (sequelize, DataTypes) => {
    const userroles = sequelize.define('userroles', {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', // Reference to pimdUsers table
          key: 'id',
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles', // Reference to role table
          key: 'id',
        },
      },
    });
  
    return userroles;
  };
  