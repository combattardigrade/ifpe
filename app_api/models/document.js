module.exports = (sequelize, DataTypes) => {
    return sequelize.define('document', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'in_review'
        },
        exp: {
            type: DataTypes.DATE,
            allowNull: true
        }
    })
}