module.exports = (sequelize, DataTypes) => {
    return sequelize.define('userProfile', {
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        primerNombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        segundoNombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        apellidoPaterno: {
            type: DataTypes.STRING,
            allowNull: true
        },
        apellidoMaterno: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countryOfBirth: {
            type: DataTypes.STRING,
            allowNull: true
        },
        stateOfBirth: {
            type: DataTypes.STRING,
            allowNull: true
        },        
        occupation: {
            type: DataTypes.STRING,
            allowNull: true
        },    
        sourceOfResources: {
            type: DataTypes.STRING,
            allowNull: true
        },
        curp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rfc: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
}