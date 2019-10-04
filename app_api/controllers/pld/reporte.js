const User = require('../../models/sequelize').User
const Reporte = require('../../models/sequelize').Reporte
const OperacionReporte = require('../../models/sequelize').OperacionReporte

const sequelize = require('../../models/sequelize').sequelize
const { Op } = require('sequelize')
const sendJSONresponse = require('../../../utils/index').sendJSONresponse
const moment = require('moment')

module.exports.getReportOperations = (req, res) => {
    const userId = req.user.id
    const reportId = parseInt(req.params.reportId)

    if (!userId || !reportId || isNaN(reportId)) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 2
                }
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no tiene suficientes privilegios para relizar la operación' })
            return
        }

        let report = await Reporte.findOne({
            where: {
                id: reportId,
            },
            include: [
                {
                    model: OperacionReporte,
                    // attributes: ['id', 'folio', 'tipoReporte', 'periodoReporte', 'tipoOperacion', 'monto', 'moneda', 'tipoPersona', 'categoria']
                }
            ]
        })

        if (!report) {
            sendJSONresponse(res, 200, { message: 'El reporte no fue encontrado o no existe' })
            return
        }

        sendJSONresponse(res, 200, report)
        return


    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.createReport = (req, res) => {
    const userId = req.user.id
    const alias = req.body.alias

    if (!userId || !alias) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 2
                }
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no tiene suficientes privilegios' })
            return
        }

        return Reporte.findOrCreate({
            where: {
                alias,
            },
            defaults: {
                userId,
                alias,
            },
            transaction: t
        })
            .spread((reporte, created) => {
                if (!created) {
                    sendJSONresponse(res, 200, { message: 'Ya existe un reporte con el alias ingresado' })
                    return
                }
                sendJSONresponse(res, 200, reporte)
                return
            })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.getAllReportsByPage = (req, res) => {
    const userId = req.user.id
    const page = req.params.page ? parseInt(req.params.page) : 1
    const limit = 50
    let offset = 0
    let result, pages

    if (!userId) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 2
                }
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no tiene suficientes privilegios para realizar la acción.' })
            return
        }

        result = await Reporte.findAndCountAll({ transaction: t })

        pages = Math.ceil(result.count / limit)
        offset = limit * (page - 1)

        let reports = await Reporte.findAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            transaction: t
        })

        sendJSONresponse(res, 200, { result: reports, count: result.count, pages: pages })
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })

}

module.exports.addOperation = (req, res) => {
    const userId = req.user.id
    const reporteId = req.body.reporteId
    const tipoReporte = req.body.tipoReporte
    const periodoReporte = req.body.periodoReporte
    const folio = req.body.folio
    const organoSupervisor = req.body.organoSupervisor
    const claveSujetoObligado = req.body.claveSujetoObligado
    let localidad = req.body.localidad
    let codigoPostalSucursal = req.body.codigoPostalSucursal
    let tipoOperacion = req.body.tipoOperacion
    let instrumentoMonetario = req.body.instrumentoMonetario
    let numeroCuenta = req.body.numeroCuenta
    let monto = req.body.monto
    let moneda = req.body.moneda
    let fechaOperacion = req.body.fechaOperacion
    let fechaDeteccionOperacion = req.body.fechaDeteccionOperacion
    let nacionalidad = parseInt(req.body.nacionalidad)
    let tipoPersona = parseInt(req.body.tipoPersona)
    let razonSocial = req.body.razonSocial
    let nombre = req.body.nombre
    let apellidoPaterno = req.body.apellidoPaterno
    let apellidoMaterno = req.body.apellidoMaterno
    let rfc = req.body.rfc
    let curp = req.body.curp
    let fechaNacimiento = req.body.fechaNacimiento
    let domicilio = req.body.domicilio
    let colonia = req.body.colonia
    let ciudad = req.body.ciudad
    let telefono = req.body.telefono
    let actividadEconomica = req.body.actividadEconomica
    const consecutivoCuentas = req.body.consecutivoCuentas
    let numeroCuentaOperacionRelacionada = req.body.numeroCuentaOperacionRelacionada
    let claveSujetoObligadoOperacionRelacionada = req.body.claveSujetoObligadoOperacionRelacionada
    let nombrePersonaRelacionada = req.body.nombrePersonaRelacionada
    let apellidoPaternoPersonaRelacionada = req.body.apellidoPaternoPersonaRelacionada
    let apellidoMaternoPersonaRelacionada = req.body.apellidoMaternoPersonaRelacionada
    let descripcionOperacion = req.body.descripcionOperacion
    let razones = req.body.razones
    let categoria = req.body.categoria

    if (!userId) {
        sendJSONresponse(res, 404, { message: 'Inicia sesión para realizar la operación' })
        return
    }

    if(!reporteId) {
        sendJSONresponse(res,404,{message: 'Ingresa el identificador del reporte en el cual se agregará la operación'})
        return
    }

    sequelize.transaction(async (t) => {
        // find admin user
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 2
                }
            },
            transaction: t
        })

        // check if admin user exists and can execute the action
        if(!user) {
            sendJSONresponse(res,404,{message: 'El usuario no existe o no tiene privilegios suficientes'})
            return
        }

        // find report
        let reporte = await Reporte.findOne({
            where: {
                id: reporteId
            },
            transaction: t
        })

        // check if report exists
        if(!reporte) {
            sendJSONresponse(res,404,{message: 'El reporte ingresado no existe'})
            return
        }

        // check columan 1 - Tipo de Reporte
        if (!tipoReporte || !(tipoReporte == 1 || tipoReporte == 2 || tipoReporte == 3)) {
            sendJSONresponse(res, 404, { message: 'Ingresa un Tipo de Reporte válido' })
            return
        }

        // check columna 2 - Periodo de Reporte
        if (!periodoReporte) {
            sendJSONresponse(res, 404, { message: 'Ingresa un período de reporte válido' })
            return
        }

        if (tipoReporte == 1 && periodoReporte.length != 6) {
            sendJSONresponse(res, 404, { message: 'Ingresa un período de reporte válido. Con formato AAAAMM para Operaciones Relevantes' })
            return
        } else if ((tipoReporte == 2 || tipoReporte == 3) && periodoReporte.length != 8) {
            sendJSONresponse(res, 404, { message: 'Ingresa un período de reporte válido. Con formato AAAAMMDD para Operaciones Inusuales e Internas Preocupantes' })
            return
        }

        // check columna 3 - Folio
        if (!folio || folio.length != 6) {
            sendJSONresponse(res, 404, { message: 'Ingresa un Folio válido' })
            return
        }

        // check if folio it's not already in use
        let operacion = await OperacionReporte.findOne({ where: { reporteId, folio, }, transaction: t })

        if (operacion && 'categoria' in operacion) {
            if (operacion.categoria == 'principal' && !consecutivoCuentas || operacion.categoria == 'principal' && consecutivoCuentas == '00') {
                sendJSONresponse(res, 404, { message: 'Ya existe una operación principal en el reporte con el Folio ingresado' })
                return
            }
        }
        
        // Check columna 4 - Organo Supervisor
        if (!organoSupervisor || organoSupervisor.length != 6) {
            sendJSONresponse(res, 404, { message: 'Ingresa un Órgano Supervisor válido. El campo debe medir 6 caracteres' })
            return
        }

        // Check columna 5 - Clave Sujeto Obligado
        if (!claveSujetoObligado || !(claveSujetoObligado.length == 7 || claveSujetoObligado.length == 8)) {
            sendJSONresponse(res, 404, { message: 'Ingresa una Clave o Número de Registro del Sujeto Obligado válida. El campo debe medir entre 7 u 8 caracteres' })
            return
        }

        // Tipo de reporte 1
        // Tipo de reporte 2 o 3 que son Operaciones Principales, es decir, consecutivoCuentas == '00'
        if (tipoReporte == 1 || ((tipoReporte == 2 || tipoReporte == 3) && (!consecutivoCuentas || consecutivoCuentas == '00'))) {

            // Check columna 6 - Localidad
            // Catagolo de localidades tiene 12 caracteres
            // TO DO: Check in production if it should be 8 or 12 
            if (!localidad || localidad.length != 12) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Localidad válida. El campo debe medir 12 caracteres.' })
                return
            }

            // Check columna 7 - Codigo Postal de la Sucursal
            if (!codigoPostalSucursal || codigoPostalSucursal.length != 5) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Código Postal de la Sucursal válido. El campo debe medir 5 caracteres' })
                return
            }

            // Check columna 8 - Tipo de Operacion
            if (!tipoOperacion || tipoOperacion.length != 2) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Tipo de Operación válida. El campo debe medir 2 caracteres' })
                return
            }

            // Check columna 9 - Instrumento Monetario
            if (!instrumentoMonetario || instrumentoMonetario.length != 2) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Instrumento Monetario válido. El campo debe medir 2 caracteres.' })
                return
            }

            // Check columna 10 - Numero de cuenta
            if (!numeroCuenta || numeroCuenta.length > 16) {
                sendJSONresponse(res, 404, { message: 'Ingresa un número de cuenta, contrato u operación válido. El campo debe tener máximo 16 caracteres.' })
                return
            }

            // Check columna 11 - Monto
            if (!monto || monto.length > 17) {
                sendJSONresponse(res, 404, { message: 'Ingresa un monto válido. El campo debe medir máximo 17 caracteres' })
                return
            }

            // Check columna 12 - Moneda
            if (!moneda || moneda.length > 3) {
                sendJSONresponse(res, 404, { message: 'Ingresa una moneda válida. El campo debe medir máximo 3 caracteres' })
                return
            }

            // Check columna 13 - Fecha de la Operacion
            if (!fechaOperacion || fechaOperacion.length != 8) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Fecha de la Operación válida. El campo debe medir 8 caracteres' })
                return
            }

            // Check columna 14 - Fecha de Deteccion de la Operacion
            if (tipoReporte == 1)
                fechaDeteccionOperacion = ''
            else if (!fechaDeteccionOperacion || fechaDeteccionOperacion.length != 8) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Fecha de Detección de la Operación válida. El campo debe medir 8 caracteres' })
                return
            }

            // Check columna 15 - Nacionalidad
            if (!nacionalidad || ![1,2].includes(nacionalidad) || isNaN(nacionalidad)) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Nacionalidad válida. El campo debe medir un caracter. Debe ser 1 para nacionalidad Mexicana y 2 para nacionadliad Extranjera' })
                return
            }

            // Check columna 16 - Tipo de Persona
            if (!tipoPersona || ![1,2].includes(tipoPersona) || isNaN(tipoPersona)) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Tipo de Persona válida. El campo debe medir un caracter. Debe ser 1 para Persona Física y 2 para Persona Moral.' })
                return
            }

            // Check columna 17 - Razon Social o Denominacion
            if ((tipoPersona == 2 && !razonSocial) || (tipoPersona == 2 && razonSocial.length > 125)) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Razon Social válida. El campo debe medir máximo 125 caracteres. El campo es obligatorio cuando el campo de Tipo de Persona es Persona Moral' })
                return
            }

            // Check columna 18 - Nombre
            if ((tipoPersona == 1 && !nombre) || (tipoPersona == 1 && nombre.length > 60)) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Nombre válido. El campo debe medir máximo 60 caracteres. El campo es obligatorio cuando el campo de Tipo de Persona es Persona Física' })
                return
            }

            // Check columna 19 - Apellido Paterno
            if ((tipoPersona == 1 && !apellidoPaterno) || (tipoPersona == 1 && apellidoPaterno.length > 60)) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Apellido Paterno válido. El campo debe medir máximo 60 caracteres. El campo es obligatorio cuando el campo de Tipo de Persona es Persona Física' })
                return
            }

            // Check columna 20 - Apellido Materno
            if ((tipoPersona == 1 && !apellidoMaterno) || (tipoPersona == 1 && apellidoMaterno.length > 30)) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Apellido Materno válido. El campo debe medir máximo 30 caracteres. El campo es obligatorio cuando el campo de Tipo de Persona es Persona Física' })
                return
            }

            // Check columna 21 - RFC
            if (!rfc && !curp && !fechaNacimiento || rfc && rfc.length > 13)  {
                sendJSONresponse(res, 404, { message: 'Ingresa un RFC válido. El campo debe medir máximo 13 caracteres. El campo es opcional siempre y cuando se cuente con CURP o fecha de nacimiento, pudiendo proporcionar los 3 si se cuenta con los mismos. Es obligatorio cuando no se cuente con fecha de nacimiento y CURP' })
                return
            }

            // Check columna 22 - CURP
            if (!curp && !rfc && !fechaNacimiento || curp && curp.length != 18) {                
                sendJSONresponse(res, 404, { message: 'Ingresa un CURP válido. El campo debe medir 18 caracteres. El campo es opcional siempre y cuando se cuente con RFC o fecha de nacimiento, pudiendo proporcionar los 3 si se cuenta con los mismos. Es obligatorio cuando no se cuente con fecha de nacimiento y RFC' })
                return
            }

            // Check columna 23 - Fecha Nacimiento o Constinucion
            if (!fechaNacimiento && !rfc && !curp || fechaNacimiento && fechaNacimiento.length != 8) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Fecha de Nacimiento o de Constitución válida. El campo debe medir 8 caracteres. El campo es obligatorio si los campos "RFC" y "CURP" se encuentran vacíos y es una operación principal. En caso de personas o cuentas relacionadas debe ser nulo' })
                return
            }

            // Check columna 24 - Domicilio
            if (!domicilio || domicilio.length > 60) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Domicilio válido. El campo debe medir máximo 60 caracteres' })
                return
            }

            // Check columna 25 - Colonia
            if (!colonia || colonia.length > 30) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Colonia válida. El campo debe medir máximo 30 caracteres' })
                return
            }
            
            // Check columna 26 - Ciudad o Poblacion
            if (!ciudad || ciudad.length != 8) {                
                sendJSONresponse(res, 404, { message: 'Ingresa una Ciudad o Población válida. El campo debe medir 8 caracteres' })
                return
            }

            // Check columna 27 - Telefono
            if (!telefono || telefono.length > 40) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Teléfono válido. El campo debe medir máximo 40 caracteres' })
                return
            }

            // Check columna 28 - Actividad Economica
            if (!actividadEconomica || actividadEconomica.length != 7) {
                sendJSONresponse(res, 404, { message: 'Ingresa una Actividad Económica válida. El campo debe medir 7 caracteres' })
                return
            }

            // Columnas Operaciones Relacionadas
            // Set to null for tipoReporte == 1 (Reporte de Operaciones Relevantes)
            // Set to null if Operacion Principal without Operaciones Relacionadas
            // Columna 29 - Consecutivos de cuenta y/o Personas Relacionadas
            consecutivoCuentas
            // Columna 30 - Numero de cuenta, contrato u operacion
            numeroCuentaOperacionRelacionada = ''
            // Columna 31 - Clave del sujeto obligado relacionada
            claveSujetoObligadoOperacionRelacionada = ''
            // Columna 32 - Nombre de la persona relacionada
            nombrePersonaRelacionada = ''
            // Columna 33 - Apellido Paterno de la persona relacionada
            apellidoPaternoPersonaRelacionada = ''
            // Columna 34 - Apellido Materno de la persona relacionada
            apellidoMaternoPersonaRelacionada = ''

            if (tipoReporte == 1) {
                // Columna 35
                descripcionOperacion = ''
                // Columna 36
                razones = ''
            } else {
                // Columna 35 - Descripcion de la operacion
                if (!descripcionOperacion || descripcionOperacion.length > 4000) {
                    sendJSONresponse(res, 404, { message: 'Ingresa una descripción de la operación. El campo debe tener máximo 4,000 caracteres.' })
                    return
                }

                // Columna 36 - Razones por las que se considera la operacion como inusual o interna preocupante
                if (!razones || razones.length > 4000) {
                    sendJSONresponse(res, 404, { message: 'Ingresa las razones por las que la Operación se considera Insual o Interna Preocupante. El campo debe tener máximo 4,000 caracteres.' })
                    return
                }
            }

            categoria = 'principal'
        }
        // Operaciones Relacionadas
        else {
            // Clear variables
            // Column 6 - Localidad
            localidad = ''
            // Column 7 - Codigo Postal Sucursal
            codigoPostalSucursal = ''
            // Column 8 - Tipo Operacion
            tipoOperacion = ''
            // Column 9 - Instrumento Monetario
            instrumentoMonetario = ''
            // Column 10 - Numero de Cuenta
            numeroCuenta = ''
            // Columna 11 - Monto
            monto = ''
            // Columna 12 - Moneda
            moneda = ''
            // Columna 13 - Fecha de la Operacion
            fechaOperacion = ''
            // Columna 14 - Fecha de Deteccion de la Operacion
            fechaDeteccionOperacion = ''
            // Columna 15 - Nacionalidad
            nacionalidad = ''
            // Columna 16 - Tipo de Persona
            tipoPersona = ''
            // Columna 17 - Razon Social
            razonSocial = ''
            // Columna 18 - Nombre
            nombre = ''
            // Columna 19 - Apellido Paterno
            apellidoPaterno = ''
            // Columna 20 - Apellido Materno
            apellidoMaterno = ''
            // Columna 21 - RFC
            rfc = ''
            // Columna 22 - CURP
            curp = ''
            // Columna 23 - Fecha de Nacimiento o Constitucion
            fechaNacimiento = ''
            // Columna 24 - Domicilio
            domicilio = ''
            // Columna 25 - Colonia
            colonia = ''
            // Columna 26 - Ciudad o Poblacion
            ciudad = ''
            // Columna 27 - Telefono
            telefono = ''
            // Columna 28 - Actividad Economica
            actividadEconomica = ''
            // Check columna 29 - Consecutivo de cuentas (para operaciones relacionadas)
            if (consecutivoCuentas.length != 2) {
                sendJSONresponse(res, 404, { message: 'Ingresa un Identificador Consecutivo de Cuentas válido. El campo debe medir 2 caracteres. Si es una Operación Relacionada, el consecutivo deberá ir desde `01` hasta el `n` número de personas o cuentas relacionadas.' })
                return
            }

            operacion = await OperacionReporte.findOne({
                where: {
                    reporteId, 
                    categoria: 'relacionada', 
                    folio,
                    consecutivoCuentas
                }, 
                transaction: t
            })

            if(operacion) {
                sendJSONresponse(res, 404, {message: 'Ya existe una operación relacionada con el mismo folio y consecutivo de cuentas'})
                return
            }

            // Check columna 30 - Numero de cuenta, contrato de la operacion relacionada
            if (!numeroCuentaOperacionRelacionada || numeroCuentaOperacionRelacionada.length > 16) {
                sendJSONresponse(res, 404, { message: 'Ingresa un número de cuenta o contrato de la Operación Relacioada. El campo debe medir máximo 16 caracteres.' })
                return
            }
            // Check columna 31 - Clave del Sujeto Obligado
            if (!claveSujetoObligadoOperacionRelacionada || claveSujetoObligadoOperacionRelacionada.length > 7) {
                sendJSONresponse(res, 404, { message: 'Ingresa la Clave del Sujeto Obligado de la Operación relacionada. El campo debe medir máximo 7 caracteres' })
                return
            }
            // Check columna 32 - Nombre del titular de la cuenta u operacion relacionada
            if (!nombrePersonaRelacionada || nombrePersonaRelacionada.length > 60) {
                sendJSONresponse(res, 404, { message: 'Ingresa el nombre del titular de la cuenta u operación relacionda. El campo debe tener máximo 60 caracteres.' })
                return
            }
            // Check columna 33 - Apellido Paterno del titular de la cuenta u operacion relacionada
            if (!apellidoPaternoPersonaRelacionada || apellidoPaternoPersonaRelacionada.length > 60) {
                sendJSONresponse(res, 404, { message: 'Ingresa el Apellido Paterno del titular de la cuenta u operación relacionada. El campo debe tener máximo 60 caracteres' })
                return
            }
            // Check columna 34 - Apellido Materno del titular de la cuenta u operacion relacionada 
            if (!apellidoMaternoPersonaRelacionada || apellidoMaternoPersonaRelacionada.length > 30) {
                sendJSONresponse(res, 404, { message: ' Ingresa el Apellido Materno del titular de la cuenta u operación relacionada. El campo debe tener máximo 30 caracteres' })
                return
            }
            // Columna 35 - Descripcion de la Operacion
            descripcionOperacion = ''
            // Columna 36 - Razones por las que el acto u operacion se considera inusual o interna preocupante
            razones = ''

            categoria = 'relacionada'
        }

        // insert into database
        let operacionReporte = await OperacionReporte.create({
            // reporte
            reporteId,
            // Columna 1
            tipoReporte,
            // Columna 2
            periodoReporte,
            // Columna 3
            folio,
            // Columna 4
            organoSupervisor,
            // Columna 5
            claveSujetoObligado,
            // Columna 6
            localidad,
            // Columna 7
            codigoPostalSucursal,
            // Columna 8
            tipoOperacion,
            // Columna 9
            instrumentoMonetario,
            // Columna 10
            numeroCuenta,
            // Columna 11
            monto,
            // Columna 12
            moneda,
            // Columna 13
            fechaOperacion,
            // Columna 14
            fechaDeteccionOperacion,
            // Columna 15
            nacionalidad,
            // Columna 16
            tipoPersona,
            // Columna 17
            razonSocial,
            // Columna 18
            nombre,
            // Columna 19
            apellidoPaterno,
            // Columna 20
            apellidoMaterno,
            // Columna 21
            rfc,
            // Columna 22
            curp,
            // Columna 23
            fechaNacimiento,
            // Columna 24
            domicilio,
            // Columna 25
            colonia,
            // Columna 26
            ciudad,
            // Columna 27
            telefono,
            // Columna 28
            actividadEconomica,
            // Columna 29
            consecutivoCuentas,
            // Columna 30
            numeroCuentaOperacionRelacionada,
            // Columna 31
            claveSujetoObligadoOperacionRelacionada,
            // Columna 32
            nombrePersonaRelacionada,
            // Columna 33
            apellidoPaternoPersonaRelacionada,
            // Columna 34
            apellidoMaternoPersonaRelacionada,
            // Columna 35
            descripcionOperacion,
            // Columna 36
            razones,
            categoria
        }, { transaction: t })

        sendJSONresponse(res,200,operacionReporte)
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, {message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })
}


