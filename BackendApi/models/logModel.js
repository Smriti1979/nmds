//user model
module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define( "log", {
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userIp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        api: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // requestType: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        statusCode: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {timestamps: true}, )
    return Logs
}