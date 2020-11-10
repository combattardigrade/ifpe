module.exports = (sequelize, DataTypes) => {
    return sequelize.define('personasBloqueadas', {
        personType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        motive: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}