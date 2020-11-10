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
        analisis: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        resultado: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dictamen: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'pendiente'
        },
        motivo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        medidas: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        oficialCumplimientoId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        riesgoClienteId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })
}