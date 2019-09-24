module.exports = (sequelize, DataTypes) => {
    return sequelize.define('address', {
        calle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ext: {
            type: DataTypes.STRING,
            allowNull: false
        },
        int: {
            type: DataTypes.STRING,
            allowNull: true
        },
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
            allowNull: true
        },
        municipio: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ciudad: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pais: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}