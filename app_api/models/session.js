module.exports = (sequelize, DataTypes) => {
    return sequelize.define('session', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deviceFingerprintId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        exp: {
            type: DataTypes.DATE,
            allowNull: false
        }
    })
}