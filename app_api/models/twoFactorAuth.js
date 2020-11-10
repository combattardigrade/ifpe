module.exports = (sequelize, DataTypes) => {
    return sequelize.define('twoFactorAuth', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}