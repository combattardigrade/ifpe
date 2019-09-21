module.exports = (sequelize, DataTypes) => {
    return sequelize.define('companyData', {
        razonSocial: {
            type: DataTypes.STRING,
            allowNull: false
        },
        giroMercantil: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fechaConstitucion: {
            type: DataTypes.STRING,
            allowNull: false,
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
            allowNull: false
        },
        segundoNombreRepresentante: {
            type: DataTypes.STRING,
            allowNull: true
        },
        apellidoPaternoRepresentante: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellidoMaternoRepresentante: {
            type: DataTypes.STRING,
            allowNull: false
        },
        curpRepresentante: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rfcRepresentante: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
}