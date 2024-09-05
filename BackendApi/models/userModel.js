//user model
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define( "user", {
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            isEmail: true, 
            allowNull: false
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {timestamps: true}, )
    return User
}