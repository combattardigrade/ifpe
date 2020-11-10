module.exports = (sequelize, DataTypes) => {
    return sequelize.define('authRequest', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        exp: {
            type: DataTypes.DATE,
            allowNull: true,            
        },
        used: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    })
}