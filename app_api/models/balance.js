module.exports = (sequelize, DataTypes) => {
    return sequelize.define('balance', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        assetId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        available: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: 0
        },
        locked: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: false,
            defaultValue: 0
        }
    })
}