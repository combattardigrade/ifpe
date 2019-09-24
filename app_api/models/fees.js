module.exports = (sequelize, DataTypes) => {
    return sequelize.define('fees', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        operation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        method: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'in_review'
        }
    })
}