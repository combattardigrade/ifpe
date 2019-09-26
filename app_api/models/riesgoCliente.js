module.exports = (sequelize, DataTypes) => {
    return sequelize.define('riesgoCliente', { 
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },    
        elemento: {
            type: DataTypes.STRING,
            allowNull: true
        },
        indicador: {
            type: DataTypes.STRING,
            allowNull: true
        },
        valor: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        nivel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ponderacion: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}