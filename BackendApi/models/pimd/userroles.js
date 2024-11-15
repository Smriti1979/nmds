module.exports = (sequelize, DataTypes) => {
    const userroles = sequelize.define('userroles', {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'pimdusers', // Reference to pimdUsers table
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
  