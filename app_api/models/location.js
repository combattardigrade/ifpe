module.exports = (sequelize, DataTypes) => {
    return sequelize.define('location', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lat: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lng: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}