const User = require('../models/sequelize').User
const PersonaBloqueada = require('../models/sequelize').PersonaBloqueada
const PersonaSancionada = require('../models/sequelize').PersonaSancionada
const MatrizRiesgo = require('../models/sequelize').MatrizRiesgo

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

module.exports.addRiskFactor = (req,res) => {
    const userId = req.user.id
    const elemento = req.body.elemento
    const indicador = req.body.indicador
    const nivel = req.body.nivel
    const ponderacion = req.body.ponderacion
    const descripcion = req.body.descripcions
    
    if(!userId || !elemento || !indicador || !nivel || !ponderacion) {
        sendJSONresponse(res,404,{message: 'Ingresa todos los campos requeridos'})
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

        if(!user) {
            sendJSONresponse(res,404,{message: 'El usuario no existe o no cuenta con los privilegios requeridos'})
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
                if(!created) {
                    sendJSONresponse(res, 200, {message: 'El factor de riesgo ingresado ya se encuentra registrado'})
                    return
                }

                sendJSONresponse(res,200,{riskFactor})
                return
            })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
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

module.exports.importPersonasBloqueadasFile = (req,res) => {
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

module.exports.importPersonasSancionadasFile = (req,res) => {
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

module.exports.importPaisesPersonasSancionadasFile = (req,res) => {
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
                    if(p) {
                        if(p.country != '') {
                            if(!(p.country).includes(blockedPerson.country)) {
                                p.country = p.country + ',' + blockedPerson.country
                                return p.save({transaction: t})
                            }                            
                        } else {
                            p.country = blockedPerson.country
                            return p.save({transaction: t})
                        }                        
                    }
                })
        })        
    })
}