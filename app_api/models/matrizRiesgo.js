module.exports = (sequelize, DataTypes) => {
    return sequelize.define('matrizRiesgo', {
        elemento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        indicador: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nivel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ponderacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}