module.exports = (sequelize, DataTypes) => {
    return sequelize.define('card', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cardType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nameOnCard: {
            type: DataTypes.STRING,
            allowNull: true
        },
        number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        expMonth: {
            type: DataTypes.STRING,
            allowNull: true
        },
        expYear: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cvv: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        batch: {
            type: DataTypes.STRING,
            allowNull: true
        },
        issuer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}