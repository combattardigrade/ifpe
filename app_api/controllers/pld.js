const User = require('../models/sequelize').User
const PersonaBloqueada = require('../models/sequelize').PersonaBloqueada
const PersonaSancionada = require('../models/sequelize').PersonaSancionada
const PersonaBoletinada = require('../models/sequelize').PersonaBoletinada
const MatrizRiesgo = require('../models/sequelize').MatrizRiesgo
const UserProfile = require('../models/sequelize').UserProfile
const CompanyProfile = require('../models/sequelize').CompanyProfile
const RiesgoCliente = require('../models/sequelize').RiesgoCliente
const Address = require('../models/sequelize').Address
const UnusualOperation = require('../models/sequelize').UnusualOperation

const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')
const sendJSONresponse = require('../../utils/index').sendJSONresponse


function generateReportFile(params) {
    const tipoReporte = params.tipoReporte

    if (!tipoReporte)
        return 'Ingresa el Tipo de Reporte'
    if (tipoReporte.length !== 1)
        return
}

module.exports.generateReport = (req, res) => {
    const userId = req.user.id
    const tipoReporte = req.body.tipoReporte
    const periodoReporte = req.body.periodoReporte
    const folio = req.body.folio
    const organoSupervisor = req.body.organoSupervisor
    const claveRegistroSujetoObligado = req.body.claveRegistroSujetoObligado
    const localidad = req.body.localidad

    if (!userId || !operationId) {
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

        Unu
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.editRiskFactor = (req, res) => {
    const userId = req.user.id
    const riskFactorId = parseInt(req.body.riskFactorId)
    const indicador = req.body.indicador
    const nivel = req.body.nivel
    const descripcion = req.body.descripcion
    let ponderacion

    if (!userId || !riskFactorId || !indicador || !nivel || !descripcion) {
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
                },
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no tiene privilegios suficientes' })
            return
        }

        let riskFactor = await MatrizRiesgo.findOne({
            where: {
                id: riskFactorId
            },
            transaction: t
        })

        if (!riskFactor) {
            sendJSONresponse(res, 404, { message: 'El factor de riesgo no existe' })
            return
        }

        if (nivel == 'bajo')
            ponderacion = 1
        else if (nivel == 'medio')
            ponderacion = 2
        else if (nivel == 'alto')
            ponderacion = 3

        riskFactor.indicador = indicador
        riskFactor.nivel = nivel
        riskFactor.ponderacion = ponderacion
        riskFactor.descripcion = descripcion
        await riskFactor.save({ transaction: t })

        sendJSONresponse(res, 200, riskFactor)
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.addRiskFactor = (req, res) => {
    const userId = req.user.id
    const elemento = req.body.elemento
    const indicador = req.body.indicador
    const nivel = req.body.nivel
    const ponderacion = req.body.ponderacion
    const descripcion = req.body.descripcion

    if (!userId || !elemento || !indicador || !nivel || !ponderacion) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {

        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            }
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no cuenta con los privilegios requeridos' })
            return
        }

        return MatrizRiesgo.findOrCreate({
            where: {
                elemento,
                indicador,
            },
            defaults: {
                elemento,
                indicador,
                nivel,
                ponderacion,
                descripcion,

            },
            transaction: t
        })
            .spread((riskFactor, created) => {
                if (!created) {
                    sendJSONresponse(res, 200, { message: 'El factor de riesgo ingresado ya se encuentra registrado' })
                    return
                }

                sendJSONresponse(res, 200, { riskFactor })
                return
            })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.getRiskFactors = (req, res) => {
    const userId = req.user.id
    const elemento = req.params.elemento ? req.params.elemento : 'all'
    const page = req.params.page ? parseInt(req.params.page) : 1
    const limit = 50
    let offset = 0
    let pages, result, riskFactors

    if (!userId || !elemento || !page) {
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

        if (elemento == 'all') {
            result = await MatrizRiesgo.findAndCountAll({
                where: {
                    estado: 'activo'
                },
                transaction: t
            })
            pages = Math.ceil(result.count / limit)
            offset = limit * (page - 1)
            riskFactors = await MatrizRiesgo.findAll({ where: { estado: 'activo' }, transaction: t })
        } else {
            result = await MatrizRiesgo.findAndCountAll({
                where: {
                    elemento,
                    estado: 'activo'
                },
                transaction: t
            })
            pages = Math.ceil(result.count / limit)
            offset = limit * (page - 1)
            riskFactors = await MatrizRiesgo.findAll({
                where: {
                    elemento,
                    estado: 'activo'
                },
                transaction: t
            })
        }

        sendJSONresponse(res, 200, { result: riskFactors, count: result.count, pages: pages })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })

}

module.exports.addNameToList = (req, res) => {
    const userId = req.user.id
    const name = req.body.name
    const personType = req.body.personType
    const motive = req.body.motive
    const country = req.body.country
    const list = req.body.list

    if (!userId || !name || !personType || !motive || !list) {
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
            }
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no tiene suficientes privilegios' })
            return
        }

        // select list
        if (list == 'bloqueadas') {
            return PersonaBloqueada.findOrCreate({
                where: {
                    name: name
                },
                defaults: {
                    name,
                    personType,
                    motive,
                    country
                },
                transaction: t
            })
                .spread((p, created) => {
                    if (!created) {
                        sendJSONresponse(res, 200, { message: 'La persona ya existe en la lista', status: 'ERROR' })
                        return
                    }
                    sendJSONresponse(res, 200, { message: 'Persona añadida a la lista correctamente', status: 'OK' })
                    return
                })
        } else if (list == 'sancionadas') {
            return PersonaSancionada.findOrCreate({
                where: {
                    name: name
                },
                defaults: {
                    name,
                    personType,
                    motive,
                    country
                },
                transaction: t
            })
                .spread((p, created) => {
                    if (!created) {
                        sendJSONresponse(res, 200, { message: 'La persona ya existe en la lista', status: 'ERROR' })
                        return
                    }
                    sendJSONresponse(res, 200, { message: 'Persona añadida a la lista correctamente', status: 'OK' })
                    return
                })
        } else if (list == 'boletinadas') {
            return PersonaBoletinada.findOrCreate({
                where: {
                    name: name
                },
                defaults: {
                    name,
                    personType,
                    motive,
                    country
                },
                transaction: t
            })
                .spread((p, created) => {
                    if (!created) {
                        sendJSONresponse(res, 200, { message: 'La persona ya existe en la lista', status: 'ERROR' })
                        return
                    }
                    sendJSONresponse(res, 200, { message: 'Persona añadida a la lista correctamente', status: 'OK' })
                    return
                })
        } else if (list == 'peps') {
            // To Do
        }
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.getListByPage = (req, res) => {
    const userId = req.user.id
    const list = req.params.list
    const page = req.params.page ? parseInt(req.params.page) : 1
    const limit = 50
    let offset = 0
    let pages, personas

    if (!userId || !list || isNaN(page)) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            }
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no tiene suficientes privilegios' })
            return
        }

        let result
        if (list === 'bloqueadas') {
            result = await PersonaBloqueada.findAndCountAll({
                transaction: t
            })
        } else if (list === 'sancionadas') {
            result = await PersonaSancionada.findAndCountAll({
                transaction: t
            })
        } else if (list === 'boletinadas') {
            result = await PersonaBoletinada.findAndCountAll({
                transaction: t
            })
        } else if (list === 'peps') {
            result = await PersonaBoletinada.findAndCountAll({
                transaction: t
            })
        }

        pages = Math.ceil(result.count / limit)
        offset = limit * (page - 1)

        if (list === 'bloqueadas') {
            personas = await PersonaBloqueada.findAll({
                limit,
                offset,
                transaction: t
            })
        } else if (list === 'sancionadas') {
            personas = await PersonaSancionada.findAll({
                limit,
                offset,
                transaction: t
            })
        } else if (list === 'boletinadas') {
            personas = await PersonaBoletinada.findAll({
                limit,
                offset,
                transaction: t
            })
        } else if (list === 'peps') {
            // TO DO:
            // Add PEPs List
            personas = await PersonaBoletinada.findAll({
                limit,
                offset,
                transaction: t
            })
        }

        sendJSONresponse(res, 200, { result: personas, count: result.count, pages: pages })
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.generalListSearch = (req, res) => {
    const userId = req.user.id
    const name = req.body.name

    if (!userId || !name) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'Your account does not exist or does not have enough privileges' })
            return
        }

        let personasBloqueadas = await PersonaBloqueada.findAll({
            where: {
                name: {
                    [Op.like]: '%' + name + '%'
                }
            },
            limit: 10,
            transaction: t
        })

        let personasSancionadas = await PersonaSancionada.findAll({
            where: {
                name: {
                    [Op.like]: '%' + name + '%'
                }
            },
            limit: 10,
            transaction: t
        })

        let personasBoletinadas = await PersonaBoletinada.findAll({
            where: {
                name: {
                    [Op.like]: '%' + name + '%'
                }
            },
            limit: 10,
            transaction: t
        })

        // Add PEPs
        let peps = []

        sendJSONresponse(res, 200, { personasBloqueadas, personasSancionadas, personasBoletinadas, peps })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.findBlockedPerson = (req, res) => {
    const userId = req.user.id
    const name = req.body.name

    if (!userId || !name) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'Your account does not exist or does not have enough privileges' })
            return
        }

        let searchUser = await PersonaBloqueada.findAll({
            where: {
                name: {
                    [Op.like]: '%' + name + '%'
                }
            },
            limit: 10,
            transaction: t
        })

        if (!searchUser) {
            sendJSONresponse(res, 404, { message: 'El usuario no fue encontrado' })
            return
        }

        sendJSONresponse(res, 200, { searchUser })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })

}

module.exports.findSanctionedPerson = (req, res) => {
    const userId = req.user.id
    const name = req.body.name

    if (!userId || !name) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'Your account does not exist or does not have enough privileges' })
            return
        }

        let searchUser = await PersonaSancionada.findAll({
            where: {
                name: {
                    [Op.like]: '%' + name + '%'
                }
            },
            limit: 10,
            transaction: t
        })

        if (!searchUser) {
            sendJSONresponse(res, 404, { message: 'El usuario no fue encontrado' })
            return
        }

        sendJSONresponse(res, 200, { searchUser })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })

}

module.exports.importPersonasBloqueadasFile = (req, res) => {
    const list = require('../../uploads/lists/personasBloqueadas.json')

    list.map((blockedPerson) => {
        sequelize.transaction((t) => {
            return PersonaBloqueada.findOrCreate({
                where: {
                    name: blockedPerson.name,
                },
                defaults: {
                    name: blockedPerson.name,
                    personType: blockedPerson.person_type,
                    motive: blockedPerson.motive,
                    country: blockedPerson.country
                },
                transaction: t
            })
        })
    })
}

module.exports.importPersonasSancionadasFile = (req, res) => {
    const list = require('../../uploads/lists/ofac1.json')

    list.map((blockedPerson) => {
        sequelize.transaction((t) => {
            return PersonaSancionada.findOrCreate({
                where: {
                    name: blockedPerson.name,
                },
                defaults: {
                    name: blockedPerson.name,
                    personType: blockedPerson.person_type,
                    motive: blockedPerson.motive,
                    country: blockedPerson.country,
                    ofacId: blockedPerson.ofac_id
                },
                transaction: t
            })
        })
    })
}

module.exports.importPaisesPersonasSancionadasFile = (req, res) => {
    const list = require('../../uploads/lists/ofac2.json')

    list.map((blockedPerson) => {
        sequelize.transaction((t) => {
            return PersonaSancionada.findOne({
                where: {
                    ofacId: blockedPerson.ofac_id
                },
                transaction: t
            })
                .then((p) => {
                    if (p) {
                        if (p.country != '') {
                            if (!(p.country).includes(blockedPerson.country)) {
                                p.country = p.country + ',' + blockedPerson.country
                                return p.save({ transaction: t })
                            }
                        } else {
                            p.country = blockedPerson.country
                            return p.save({ transaction: t })
                        }
                    }
                })
        })
    })
}

// Unusual Operations

module.exports.getUnusualOperations = (req, res) => {
    const userId = req.user.id
    const status = req.params.status

    if (!userId || !status) {
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
            }
        })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}




// calculate initial risk
// 1) actividad_economica / profesion - done
// 2) tipo_entidad 
// 3) tipologias - done
// 4) ubicacion geografica - done
// 5) listas - done
// 6) origen y destino de los recursos - done
// 7) Nacionalidad - done

// edad - done

module.exports.calculateInitialRisk = (req, res) => {
    const adminId = req.user.id
    const userId = req.params.userId

    if (!adminId || !userId) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let admin = await User.findOne({
            where: {
                id: adminId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            }
        })

        if (!admin) {
            sendJSONresponse(res, 404, { message: 'La cuenta de administrador no existe o no tiene privilegios suficientes' })
            return
        }

        // get user profile
        let user = await User.findOne({
            where: {
                id: userId
            },
            include: [
                {
                    model: UserProfile
                },
                {
                    model: CompanyProfile
                },
                {
                    model: Address,
                    where: {
                        status: 'active'
                    }
                }
            ]
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no fue encontrado o el perfil no esta completo' })
            return
        }

        // accountType
        if (user.accountType === 'persona_fisica') {
            // check if user profile is complete and can be evaluated
            if (!('userProfile' in user) || !('addresses' in user)) {
                sendJSONresponse(res, 404, { message: 'Perfil de usuario incompleto, no es posible calcular el riesgo inicial' })
                return
            }

            // Set firstName and lastName
            const firstName = user.userProfile.primerNombre
            // if user doesn't have apellido materno
            let lastName

            if (!('apellidoMaterno' in user.userProfile) || user.userProfile.apellidoMaterno == 'x') {
                lastName = user.userProfile.apellidoPaterno
            } else {
                lastName = user.userProfile.apellidoPaterno + ' ' + user.userProfile.apellidoMaterno
            }

            // Check Sanctioned People List
            await checkSanctionedPeopleList(firstName, lastName, userId)

            // Check Blocked People List
            await checkBlockedPeopleList(lastName, userId)

            // Check Reported People List
            await checkReportedUsersList(lastName, user.email, userId)

            // Check nationality
            await checkNationality(user.nationality, userId)

            // Check residence address (country, state)
            await checkResidenceAddress(user.addresses[0].pais, user.addresses[0].state, userId)

            // Check Occupation
            if (user.userProfile.occupation != '') {
                await checkOccupation(user.userProfile.occupation, userId)
            }

            // Check Source of Income
            if (user.userProfile.sourceOfResources != '') {
                await checkSourceOfIncome(user.userProfile.sourceOfResources, userId)
            }

            // Check age
            await checkAge(user.userProfile.dateOfBirth, userId)


            // calculate initial risk
            calculateRisk(userId)



            sendJSONresponse(res, 200, { user })
            return

        } else if (user.accountType === 'persona_moral') {
            // check if user profile is complete and can be evaluated
            if (!('companyProfile' in user) || !('addresses' in user)) {
                sendJSONresponse(res, 404, { message: 'Perfil de usuario incompleto, no es posible calcular el riesgo inicial' })
                return
            }

            // Set firstName and lastName
            const companyName = user.companyProfile.razonSocial

            // Check Sanctioned People List
            await checkSanctionedPeopleList(null, null, userId, companyName)

            // Check Blocked People List
            await checkBlockedPeopleList(companyName, userId)

            // Check Reported People List
            await checkReportedUsersList(companyName, user.email, userId)

            // Check nationality
            await checkNationality(user.nationality, userId)

            // Check residence address (country, state)
            await checkResidenceAddress(user.addresses[0].pais, user.addresses[0].state, userId)

            // Check Occupation
            if (user.companyProfile.giroMercantil != '') {
                await checkOccupation(user.companyProfile.giroMercantil, userId)
            }

            // Check Source of Income
            if (user.companyProfile.origenRecursos != '') {
                await checkSourceOfIncome(user.companyProfile.origenRecursos, userId)
            }

            // Check age
            // await checkAge(user.userProfile.dateOfBirth, userId)


            // calculate initial risk
            calculateRisk(userId)

            sendJSONresponse(res, 200, { user })
            return
        }

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

async function calculateRisk(userId) {
    // Evaluate risks
    let riskFactors = await RiesgoCliente.findAll({
        where: {
            userId,
        }
    })

    let nivelRiesgo = 'bajo'

    if (riskFactors.length > 0) {

        for (let i = 0; i < riskFactors.length; i++) {
            let risk = riskFactors[i]
            let tituloAlerta, tipoAlerta

            // set nivelRiesgo
            if (nivelRiesgo == 'bajo' && risk.nivel != 'bajo') {
                nivelRiesgo = risk.nivel
            } else if (nivelRiesgo == 'medio' && (risk.nivel == 'alto' || risk.nivel == 'muy_alto')) {
                nivelRiesgo = risk.nivel
            }

            if (risk.elemento == 'listas' || risk.nivel == 'alto') {
                if (risk.elemento == 'listas') {
                    tituloAlerta = 'Posible operación inusual por encontrarse en lista de ' + risk.indicador
                    tipoAlerta = 'alerta_critica'
                } else if (risk.elemento == 'nacionalidad' && risk.nivel == 'alto') {
                    tituloAlerta = 'Posible operación inusual por nacionalidad considerada de riesgo'
                    tipoAlerta = 'alerta'
                } else if (risk.elemento == 'pais' && risk.nivel == 'alto') {
                    tituloAlerta = 'Posible operación inusual por país de residencia considerado de riesgo'
                    tipoAlerta = 'alerta'
                } else if (risk.elemento == 'estado' && risk.nivel == 'alto') {
                    tituloAlerta = 'Posible operación inusual por estado considerado de riesgo'
                    tipoAlerta = 'alerta'
                } else if (risk.elemento == 'tipologia' && risk.nivel == 'alto') {
                    tituloAlerta = 'Posible operación inusual por tipología considerada de riesgo alto'
                    tipoAlerta = 'alerta'
                } else if (risk.elemento == 'actividad_economica' && risk.nivel == 'alto') {
                    tituloAlerta = 'Posible operación inusual por actividad económica considerada de riesgo alto'
                    tipoAlerta = 'alerta'
                } else if (risk.elemento == 'origen_recursos' && risk.nivel == 'alto') {
                    tituloAlerta = 'Posible operación inusual por origen de los recursos considerado de riesgo alto'
                    tipoAlerta = 'alerta'
                }
                UnusualOperation.findOrCreate({ where: { userId, tituloAlerta, tipoAlerta, riesgoClienteId: risk.id } })
            }
        }
    }

    // Set risk level 
    let user = await User.findOne({
        where: {
            id: userId
        },
        include: [
            {
                model: UserProfile
            },
            {
                model: CompanyProfile
            }
        ]
    })

    if (user.accountType == 'persona_fisica') {
        user.userProfile.nivelRiesgo = nivelRiesgo
        await user.userProfile.save()
    } else if (user.accountType == 'persona_moral') {
        user.companyProfile.nivelRiesgo = nivelRiesgo
        await user.companyProfile.save()
    }

    console.log({ message: 'Determinación del nivel de riesgo inicial completada' })
    return
}

async function checkAge(dateOfBirth, userId) {
    dateOfBirth = moment(dateOfBirth, 'DD/MM/YYYY')
    let years = moment().diff(dateOfBirth, 'years')

    if (years > 25) return

    let matrixSearch = await MatrizRiesgo.findOne({
        where: {
            elemento: 'tipologia',
            indicador: {
                [Op.like]: 'El cliente es menor de 25 años'
            }
        }
    })

    if (!matrixSearch) return

    await RiesgoCliente.findOrCreate({
        where: {
            userId,
            elemento: 'tipologia',
            indicador: matrixSearch.indicador,
            valor: 'Edad: ' + years + ' años',
            nivel: matrixSearch.nivel,
            ponderacion: matrixSearch.ponderacion,
            descripcion: matrixSearch.descripcion
        }
    })
}

async function checkResidenceAddress(country, state, userId) {
    let countrySearch = await MatrizRiesgo.findOne({
        where: {
            elemento: 'pais',
            indicador: country,
        }
    })

    if (countrySearch) {
        // save risk
        await RiesgoCliente.findOrCreate({
            where: {
                userId,
                elemento: 'pais',
                indicador: countrySearch.indicador,
                valor: countrySearch.indicador,
                nivel: countrySearch.nivel,
                ponderacion: countrySearch.ponderacion,
                descripcion: countrySearch.descripcion
            }
        })
    }

    let stateSearch = await MatrizRiesgo.findOne({
        where: {
            elemento: 'estado',
            indicador: state
        }
    })

    if (stateSearch) {
        await RiesgoCliente.findOrCreate({
            where: {
                userId,
                elemento: 'estado',
                indicador: stateSearch.indicador,
                valor: stateSearch.indicador,
                nivel: stateSearch.nivel,
                ponderacion: stateSearch.ponderacion,
                descripcion: stateSearch.descripcion
            }
        })
    }
}

async function checkNationality(nationality, userId) {
    if (nationality != 'Mexico') {
        let matrix = await MatrizRiesgo.findOne({
            where: {
                elemento: 'nacionalidad',
                indicador: nationality
            }
        })

        // es extranjero y de un pais de riesgo
        if (matrix) {
            // save risk
            await RiesgoCliente.findOrCreate({
                where: {
                    userId,
                    elemento: 'nacionalidad',
                    indicador: matrix.indicador,
                    valor: matrix.indicador,
                    nivel: matrix.nivel,
                    ponderacion: matrix.ponderacion,
                    descripcion: matrix.descripcion
                }
            })
        } else {
            matrix = await MatrizRiesgo.findOne({
                where: {
                    elemento: 'nacionalidad',
                    indicador: 'extranjero'
                }
            })
            // es extranjero, pero no de un pais de riesgo
            await RiesgoCliente.findOrCreate({
                where: {
                    userId,
                    elemento: 'nacionalidad',
                    indicador: 'extranjero',
                    valor: nationality,
                    nivel: matrix.nivel,
                    ponderacion: matrix.ponderacion,
                    descripcion: matrix.descripcion
                }
            })
        }
    }
}


async function checkSanctionedPeopleList(firstName, lastName, userId, companyName = '') {

    let results
    // personType
    if (companyName == '') {
        // find individual in list
        results = await PersonaSancionada.findAll({
            where: {
                name: {
                    [Op.like]: '%' + lastName + ', ' + firstName + '%'
                }
            },
            limit: 10
        })
    } else {
        // find company in list
        results = await PersonaSancionada.findAll({
            where: {
                name: {
                    [Op.like]: '%' + companyName + '%'
                }
            },
            limit: 10
        })
    }

    if (!results) return false

    // if name is found then insert risk
    if (results.length > 0) {

        // search in risk matriz
        let matrix = await MatrizRiesgo.findOne({
            where: {
                elemento: 'listas',
                indicador: 'personas_sancionadas'
            },

        })

        // save risk
        await RiesgoCliente.findOrCreate({
            where: {
                userId,
                elemento: 'listas',
                indicador: 'personas_sancionadas',
                valor: JSON.stringify(results),
                nivel: matrix.nivel,
                ponderacion: matrix.ponderacion,
                descripcion: matrix.descripcion
            }
        })
    }
}

async function checkBlockedPeopleList(name, userId) {
    let results = await PersonaBloqueada.findAll({
        where: {
            name: {
                [Op.like]: '%' + name + '%'
            },
        },
        limit: 10
    })

    if (!results) return false

    // if name is found then insert risk
    if (results.length > 0) {

        // search in risk matriz
        let matrix = await MatrizRiesgo.findOne({
            where: {
                elemento: 'listas',
                indicador: 'personas_bloqueadas'
            },

        })

        // save risk
        await RiesgoCliente.findOrCreate({
            where: {
                userId,
                elemento: 'listas',
                indicador: 'personas_bloqueadas',
                valor: JSON.stringify(results),
                nivel: matrix.nivel,
                ponderacion: matrix.ponderacion,
                descripcion: matrix.descripcion
            }
        })
    }
}

async function checkReportedUsersList(name, email, userId) {
    let results = await PersonaBoletinada.findAll({
        where: {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: '%' + name + '%'
                    },
                },
                { email: email }
            ]
        },
        limit: 10
    })

    if (!results) return false

    // if name is found then insert risk
    if (results.length > 0) {

        // search in risk matrix
        let matrix = await MatrizRiesgo.findOne({
            where: {
                elemento: 'listas',
                indicador: 'personas_boletinadas'
            },

        })

        // save risk
        await RiesgoCliente.findOrCreate({
            where: {
                userId,
                elemento: 'listas',
                indicador: 'personas_boletinadas',
                valor: JSON.stringify(results),
                nivel: matrix.nivel,
                ponderacion: matrix.ponderacion,
                descripcion: matrix.descripcion
            }
        })
    }
}

async function checkOccupation(occupation, userId) {
    // search in risk matrix
    let matrix = await MatrizRiesgo.findOne({
        where: {
            elemento: 'actividad_economica',
            indicador: {
                [Op.like]: '%' + occupation + '%'
            }
        }
    })

    if (!matrix) return

    // save risk
    await RiesgoCliente.findOrCreate({
        where: {
            userId,
            elemento: 'actividad_economica',
            indicador: matrix.indicador,
            valor: matrix.indicador,
            nivel: matrix.nivel,
            ponderacion: matrix.ponderacion,
            descripcion: matrix.descripcion
        }
    })
}

async function checkSourceOfIncome(source, userId) {
    // search in risk matrix
    let matrix = await MatrizRiesgo.findOne({
        where: {
            elemento: 'origen_recursos',
            indicador: {
                [Op.like]: '%' + source + '%'
            }
        }
    })

    if (!matrix) return

    // save risk
    await RiesgoCliente.findOrCreate({
        where: {
            userId,
            elemento: 'origen_recursos',
            indicador: matrix.indicador,
            valor: matrix.indicador,
            nivel: matrix.nivel,
            ponderacion: matrix.ponderacion,
            descripcion: matrix.descripcion
        }
    })
}


module.exports.getUnusualOperations = (req, res) => {
    const userId = req.user.id
    const status = req.params.status ? req.params.status : 'all'
    const page = req.params.page ? parseInt(req.params.page) : 1
    let limit = 50
    let offset = 0
    let pages

    if (!userId || !status || !page) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    try {
        User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            },
        })
            .then((user) => {
                if (!user) {
                    sendJSONresponse(res, 404, { message: 'El administrador no existe o no tiene suficientes privilegios' })
                    return
                }

                if (status === 'all') {
                    UnusualOperation.findAndCountAll()
                        .then((result) => {
                            pages = Math.ceil(result.count / limit)
                            offset = limit * (page - 1)
                            UnusualOperation.findAll({
                                include: [
                                    {
                                        model: User,
                                        attributes: ['id', 'email', 'phone', 'countryCode', 'accountType', 'nationality',]
                                    },
                                    {
                                        model: RiesgoCliente
                                    }
                                ],
                                limit,
                                offset
                            })
                                .then((operations) => {
                                    sendJSONresponse(res, 200, { result: operations, count: result.count, pages: pages })
                                    return
                                })
                        })
                } else {
                    UnusualOperation.findAndCountAll({
                        where: {
                            dictamen: status
                        }
                    })
                        .then((result) => {
                            pages = Math.ceil(result.count / limit)
                            offset = limit * (page - 1)
                            UnusualOperation.findAll({
                                include: [
                                    {
                                        model: User,
                                        attributes: ['id', 'email', 'phone', 'countryCode', 'accountType', 'nationality',]
                                    },
                                    {
                                        model: RiesgoCliente
                                    }
                                ],
                                where: {
                                    dictamen: status
                                },
                                limit,
                                offset
                            })
                                .then((operations) => {
                                    sendJSONresponse(res, 200, { result: operations, count: result.count, pages: pages })
                                    return
                                })
                        })
                }

            })
    }
    catch (err) {
        console.log(err)
        sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
        return
    }
}


module.exports.getUnusualOperation = (req, res) => {
    const userId = req.user.id
    const operationId = parseInt(req.params.operationId)

    if (!userId || !operationId || isNaN(operationId)) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                }
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'La cuenta no existe o no tiene suficientes privilegios' })
            return
        }

        let unusualOperation = await UnusualOperation.findOne({
            where: {
                id: operationId,
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'email', 'phone', 'countryCode', 'accountType', 'accountLevel', 'nationality', 'status', 'createdAt'],
                    include: [
                        {
                            model: UserProfile
                        },
                        {
                            model: CompanyProfile
                        },
                        {
                            model: Address,
                            where: {
                                status: 'active'
                            }
                        }
                    ]
                },
                {
                    model: RiesgoCliente,
                }
            ],
            transaction: t
        })

        if (!unusualOperation) {
            sendJSONresponse(res, 404, { message: 'Unusual Operation not found' })
            return
        }

        sendJSONresponse(res, 200, { unusualOperation })
        return
    })
        .catch(err => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.sendUnusualOperationReport = (req, res) => {
    const userId = req.user.id
    const operationId = parseInt(req.body.operationId)
    const dictamen = req.body.dictamen
    const analisis = req.body.analisis
    const resultado = req.body.resultado
    const motivo = req.body.motivo
    const medidas = req.body.medidas

    if (!userId || !operationId || !dictamen || !analisis || !resultado) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    if (isNaN(operationId)) {
        sendJSONresponse(res, 404, { message: 'El ID de la operación inusual es inválido' })
        return
    }

    if (!(dictamen != 'procedente' || dictamen != 'improcedente')) {
        sendJSONresponse(res, 404, { message: 'Ingresa un dictamen válido' })
        return
    }


    sequelize.transaction(async (t) => {
        // check that user is admin and oficial de cumplimiento (level 2)
        let user = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: 2
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe o no tiene privilegios suficientes' })
            return
        }

        // Find unusual operation where dictamen = pendiente
        // Only allow to submit pending reports, and don't allow
        // to modify reports that have already been submitted/
        let unusualOperation = await UnusualOperation.findOne({
            where: {
                id: operationId,
                dictamen: 'pendiente'
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'email', 'phone', 'countryCode', 'accountType', 'accountLevel', 'nationality', 'status', 'createdAt'],
                    include: [
                        {
                            model: UserProfile
                        },
                        {
                            model: CompanyProfile
                        },
                        {
                            model: Address,
                            where: {
                                status: 'active'
                            }
                        }
                    ]
                },
                {
                    model: RiesgoCliente,
                }
            ],
            transaction: t
        })

        if (!unusualOperation) {
            sendJSONresponse(res, 200, { message: 'La operación inusual no existe o ya fue dictaminada' })
            return
        }

        // update unusual operation report
        unusualOperation.analisis = analisis
        unusualOperation.resultado = resultado
        unusualOperation.dictamen = dictamen
        unusualOperation.motivo = motivo
        unusualOperation.medidas = medidas
        unusualOperation.oficialCumplimientoId = userId
        await unusualOperation.save({ transaction: t })

        if (dictamen == 'procedente') {
            let userProfile = await UserProfile.findOne({
                where: {
                    userId: unusualOperation.userId
                },
                transaction: t
            })

            userProfile.nivelRiesgo = 'alto'
            await userProfile.save({ transaction: t })
        }

        sendJSONresponse(res, 200, unusualOperation)
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.changeClientRiskLevel = function (req, res) {
    const adminId = req.user.id
    const clientId = req.body.clientId
    const newRiskLevel = req.body.newRiskLevel

    if (!adminId || !clientId || !newRiskLevel) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    if(!['bajo','medio','alto'].includes(newRiskLevel)) {
        sendJSONresponse(res,404,{message: 'Ingresa un nivel de riesgo válido'})
        return
    }

    sequelize.transaction(async (t) => {
        let admin = await User.findOne({
            where: {
                id: adminId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 2
                }
            },
            transaction: t
        })

        if (!admin) {
            sendJSONresponse(res, 404, { message: 'La cuenta de administrador no existe o no cuenta con suficientes privilegios' })
            return
        }

        let user = await User.findOne({
            where: {
                id: clientId,
            },
            include: [
                {
                    model: UserProfile,
                    where: {
                        nivelRiesgo: {
                            [Op.not]: 'alto'
                        }
                    }
                }
            ],
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'No es posible cambiar el nivel de riesgo de un cliente cuando este es considerado de Riesgo Alto o no existe' })
            return
        }

        user.userProfile.nivelRiesgo = newRiskLevel
        await user.userProfile.save({ transaction: t })

        sendJSONresponse(res, 200, { message: 'Nivel de riesgo actualizado correctamente', status: 'OK' })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}