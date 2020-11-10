module.exports = (sequelize, DataTypes) => {
    return sequelize.define('asset', {
        name: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        symbol: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        active: {
            type: DataTypes.DECIMAL(24,8),
            allowNull: 0
        }
    })
}