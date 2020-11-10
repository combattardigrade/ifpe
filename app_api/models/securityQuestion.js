module.exports = (sequelize, DataTypes) => {
    return sequelize.define('securityQuestion', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        firstQuestion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        secondQuestion: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thirdQuestion: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        firstAnswer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        secondAnswer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thirdQuestion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}