module.exports = (sequelize, DataTypes) => {
    return sequelize.define('unusualOperation', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tituloAlerta: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tipoAlerta: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        situacion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        medida: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dictamen: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'pendiente'
        },
        descripcionDictamen: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        riesgoClienteId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })
}