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
        alias: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'incompleto'
        }
    })
}