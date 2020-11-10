// Formato de reporte
// http://www.dof.gob.mx/nota_detalle.php?codigo=5439234&fecha=30/05/2016

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('operacionReporte', { 
        reporteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        // formato | columna 1   
        tipoReporte: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // formato | columna 2 
        periodoReporte: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 3 
        folio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 4 
        organoSupervisor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 5 
        claveSujetoObligado: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 6 
        localidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 7
        codigoPostalSucursal: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 8
        tipoOperacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 9
        instrumentoMonetario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 10
        numeroCuenta: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 11
        monto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 12
        moneda: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 13
        fechaOperacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 14
        fechaDeteccionOperacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 15
        nacionalidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 16
        tipoPersona: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 17
        razonSocial: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 18
        nombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 19
        apellidoPaterno: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 20
        apellidoMaterno: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 21
        rfc: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 22
        curp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 23
        fechaNacimiento: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 24
        domicilio: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 25
        colonia: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 26
        ciudad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 27
        telefono: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 28
        actividadEconomica: {
            type: DataTypes.STRING,
            allowNull: true
        },        
        // formato | columna 29
        consecutivoCuentas: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 30
        numeroCuentaOperacionRelacionada: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 31
        claveSujetoObligadoOperacionRelacionada: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 32
        nombrePersonaRelacionada: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 33
        apellidoPaternoPersonaRelacionada: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 34
        apellidoMaternoPersonaRelacionada: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // formato | columna 35
        descripcionOperacion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // formato | columna 36
        razones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        // principal | relacionada
        categoria: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'principal'
        }
    })
}