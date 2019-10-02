module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reporte', { 
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },    
        nombreArchivo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    })
}