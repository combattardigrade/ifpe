module.exports = (sequelize, DataTypes) => {
    return sequelize.define('pep', {
        personType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        agency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        position: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })
}