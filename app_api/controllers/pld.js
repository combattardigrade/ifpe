const User = require('../models/sequelize').User
const PersonaBloqueada = require('../models/sequelize').PersonaBloqueada
const PersonaSancionada = require('../models/sequelize').PersonaSancionada
const PersonaBoletinada = require('../models/sequelize').PersonaBoletinada
const MatrizRiesgo = require('../models/sequelize').MatrizRiesgo
const UserProfile = require('../models/sequelize').UserProfile
const RiesgoCliente = require('../models/sequelize').RiesgoCliente
const Address = require('../models/sequelize').Address

const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')
const sendJSONresponse = require('../../utils/index').sendJSONresponse


// Lista de Personas Bloqueadas
module.exports.addBlockedPerson = (req, res) => {
    const userId = req.user.id
    const name = req.body.name



    // check if user is admin

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


// calculate initial risk
// 1) actividad_economica / profesion
// 2) tipo_entidad
// 3) tipologias
// 4) ubicacion geografica - done
// 5) listas - done
// 6) origen y destino de los recursos
// 7) Nacionalidad - done

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
                    model: Address,
                    where: {
                        status: 'active'
                    }
                }
            ]
        })
        
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

async function checkResidenceAddress(country, state, userId) {
    let countrySearch = await MatrizRiesgo.findOne({
        where: {
            elemento: 'pais',
            indicador: country,
        }
    })

    if(countrySearch) {
        // save risk
        await RiesgoCliente.create({
            userId,
            elemento: 'pais',
            indicador: countrySearch.indicador,
            valor: countrySearch.indicador,
            nivel: countrySearch.nivel,
            ponderacion: countrySearch.ponderacion,
            descripcion: countrySearch.descripcion
        })
    }

    let stateSearch = await MatrizRiesgo.findOne({
        where: {
            elemento: 'estado',
            indicador: state
        }
    })

    if(stateSearch) {
        await RiesgoCliente.create({
            userId,
            elemento: 'estado',
            indicador: stateSearch.indicador,
            valor: stateSearch.indicador,
            nivel: stateSearch.nivel,
            ponderacion: stateSearch.ponderacion,
            descripcion: stateSearch.descripcion
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
            await RiesgoCliente.create({
                userId,
                elemento: 'nacionalidad',
                indicador: matrix.indicador,
                valor: matrix.indicador,
                nivel: matrix.nivel,
                ponderacion: matrix.ponderacion,
                descripcion: matrix.descripcion
            })
        } else {
            matrix = await MatrizRiesgo.findOne({
                where: {
                    elemento: 'nacionalidad',
                    indicador: 'extranjero'
                }
            })
            // es extranjero, pero no de un pais de riesgo
            await RiesgoCliente.create({
                userId,
                elemento: 'nacionalidad',
                indicador: 'extranjero',
                valor: nationality,
                nivel: matrix.nivel,
                ponderacion: matrix.ponderacion,
                descripcion: matrix.descripcion
            })
        }
    }
}


async function checkSanctionedPeopleList(firstName, lastName, userId) {

    // find in list
    let results = await PersonaSancionada.findAll({
        where: {
            name: {
                [Op.like]: '%' + lastName + ', ' + firstName + '%'
            }
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
                indicador: 'personas_sancionadas'
            },

        })

        // save risk
        await RiesgoCliente.create({
            userId,
            elemento: 'listas',
            indicador: 'personas_sancionadas',
            valor: JSON.stringify(results),
            nivel: matrix.nivel,
            ponderacion: matrix.ponderacion,
            descripcion: matrix.descripcion
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
        await RiesgoCliente.create({
            userId,
            elemento: 'listas',
            indicador: 'personas_bloqueadas',
            valor: JSON.stringify(results),
            nivel: matrix.nivel,
            ponderacion: matrix.ponderacion,
            descripcion: matrix.descripcion
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

        // search in risk matriz
        let matrix = await MatrizRiesgo.findOne({
            where: {
                elemento: 'listas',
                indicador: 'personas_boletinadas'
            },

        })

        // save risk
        await RiesgoCliente.create({
            userId,
            elemento: 'listas',
            indicador: 'personas_boletinadas',
            valor: JSON.stringify(results),
            nivel: matrix.nivel,
            ponderacion: matrix.ponderacion,
            descripcion: matrix.descripcion
        })
    }
}