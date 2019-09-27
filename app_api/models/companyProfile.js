module.exports = (sequelize, DataTypes) => {
    return sequelize.define('companyProfile', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        razonSocial: {
            type: DataTypes.STRING,
            allowNull: true
        },
        giroMercantil: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fechaConstitucion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        telefonoContacto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rfc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        primerNombreRepresentante: {
            type: DataTypes.STRING,
            allowNull: true
        },
        segundoNombreRepresentante: {
            type: DataTypes.STRING,
            allowNull: true
        },
        apellidoPaternoRepresentante: {
            type: DataTypes.STRING,
            allowNull: true
        },
        apellidoMaternoRepresentante: {
            type: DataTypes.STRING,
            allowNull: true
        },
        curpRepresentante: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rfcRepresentante: {
            type: DataTypes.STRING,
            allowNull: true
        },
        origenRecursos: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nivelRiesgo: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'no_asignado'
        }
    })
}