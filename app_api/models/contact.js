module.exports = (sequelize, DataTypes) => {
    return sequelize.define('contact', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        contactType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contactUserId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        externalAccount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}