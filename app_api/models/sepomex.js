module.exports = (sequelize, DataTypes) => {
    return sequelize.define('sepomex', {
        codigoPostal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        asentamiento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipoAsentamiento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        zona: {
            type: DataTypes.STRING,
            allowNull: true
        },
        municipio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ciudad: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}