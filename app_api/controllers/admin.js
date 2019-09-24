const User = require('../models/sequelize').User
const UserProfile = require('../models/sequelize').UserProfile
const Address = require('../models/sequelize').Address
const Balance = require('../models/sequelize').Balance
const CompanyProfile = require('../models/sequelize').CompanyProfile
const Document = require('../models/sequelize').Document
const Fees = require('../models/sequelize').Fees
const Location = require('../models/sequelize').Location
const Transaction = require('../models/sequelize').Transaction

const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const sendJSONresponse = require('../../utils/index').sendJSONresponse
const removeSpanishChars = require('../../utils/index').removeSpanishChars

module.exports.checkPrivileges = function (req, res) {
    const userId = req.user.id

    if (!userId) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    User.findOne({
        where: {
            id: userId,
            accountType: 'admin',
            accountLevel: {
                [Op.gte]: 1
            }
        },
        attributes: ['id', 'email', 'accountType', 'accountLevel']
    })
        .then((user) => {
            if (!user) {
                sendJSONresponse(res, 401, { message: 'Your account does not have enough privileges' })
                return
            }

            sendJSONresponse(res, 200, { message: 'AUTHORIZED', user })
            return
        })
}

// Get users with accountType persona_fisica or persona_moral and level >= 1
module.exports.getUsersByTypeAndLevel = function (req, res) {
    const userId = req.user.id
    const accountType = req.query.accountType ? req.query.accountType : 'all'
    const accountLevel = req.query.accountLevel ? parseInt(req.query.accountLevel) : 0
    const accountLevelGte = req.query.accountLevelGte ? parseInt(req.query.accountLevelGte) : 0
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 50
    let offset = 0
    let users, result, pages

    if (!userId) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    if (isNaN(accountLevel) || isNaN(accountLevelGte) || isNaN(page)) {
        sendJSONresponse(res, 404, { message: 'Ingresa un valor numérico válido' })
        return
    }

    

    sequelize.transaction(async (t) => {
        // check if user is admin
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
            sendJSONresponse(res, 404, { message: 'User does not exist or does not have enough privileges' })
            return
        }


        // accountType = All
        // accountLevel >= accountLevel
        if (accountType === 'all' && accountLevelGte == 1) {
            result = await User.findAndCountAll({
                where: {
                    accountLevel: {
                        [Op.gte]: accountLevel
                    },
                },
                transaction: t
            })

            pages = Math.ceil(result.count / limit)
            offset = limit * (page - 1)

            users = await User.findAll({
                where: {
                    accountLevel: {
                        [Op.gte]: accountLevel
                    },
                },
                attributes: ['id', 'email', 'phone', 'countryCode', 'email', 'nationality', 'accountType', 'accountLevel', 'createdAt'],
                include: [
                    {
                        model: UserProfile,
                    }
                ],
                limit: limit,
                offset: offset,
                transaction: t
            })

        } else if (accountType !== 'all' && accountLevelGte == 1) {

            result = await User.findAndCountAll({
                where: {
                    accountType,
                    accountLevel: {
                        [Op.gte]: accountLevel
                    }
                },
                transaction: t
            })

            pages = Math.ceil(result.count / limit)
            offset = limit * (page - 1)

            users = await User.findAll({
                where: {
                    accountType,
                    accountLevel: {
                        [Op.gte]: accountLevel
                    },
                },
                attributes: ['id', 'email', 'phone', 'countryCode', 'email', 'nationality', 'accountType', 'accountLevel', 'createdAt'],
                include: [
                    {
                        model: UserProfile,
                    }
                ],
                limit: limit,
                offset: offset,
                transaction: t
            })

        } else if (accountType === 'all' && accountLevelGte == 0) {

            result = await User.findAndCountAll({
                where: {
                    accountLevel: accountLevel
                },
                transaction: t
            })

            pages = Math.ceil(result.count / limit)
            offset = limit * (page - 1)

            users = await User.findAll({
                where: {
                    accountLevel: accountLevel
                },
                attributes: ['id', 'email', 'phone', 'countryCode', 'email', 'nationality', 'accountType', 'accountLevel', 'createdAt'],
                include: [
                    {
                        model: UserProfile,
                    }
                ],
                limit: limit,
                offset: offset,
                transaction: t
            })
        } else if (accountType !== 'all' && accountLevelGte == 0) {
            
            result = await User.findAndCountAll({
                where: {
                    accountType,
                    accountLevel,
                },
                transaction: t
            }) 
            
            pages = Math.ceil(result.count / limit)
            offset = limit * (page - 1)

            users = await User.findAll({
                where: {
                    accountType,
                    accountLevel,
                },
                attributes: ['id', 'email', 'phone', 'countryCode', 'email', 'nationality', 'accountType', 'accountLevel', 'createdAt'],
                include: [
                    {
                        model: UserProfile,
                    }
                ],
                limit: limit,
                offset: offset,
                transaction: t
            })

        } else {
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        }

        if (!users) {
            sendJSONresponse(res, 404, { message: 'No se encontraron usuarios con las características ingresadas' })
            return
        }

        sendJSONresponse(res, 200, { result: users, count: result.count, pages: pages })
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.searchUserByEmail = function(req,res) {
    const userId = req.user.id
    const email = removeSpanishChars(req.query.email)

    if(!userId || !email) {
        sendJSONresponse(res,404,{message:'Ingresa todos los campos requeridos'})
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
        
        if(!user) {
            sendJSONresponse(res,404,{message:'Your account does not exist or does not have enough privileges'})
            return
        }

        let searchUser = await User.findAll({
            where: {
                email: {
                    [Op.like]: '%' + email + '%',
                    accountType: {
                        [Op.not]: 'admin'
                    }
                }
            },
            attributes: ['id', 'email', 'phone', 'countryCode', 'email', 'nationality', 'accountType', 'accountLevel', 'createdAt'],
            include: [
                {
                    model: UserProfile,
                }
            ], 
            limite: 10,
            transaction: t
        })

        if(!searchUser) {
            sendJSONresponse(res,404,{message:'El usuario no fue encontrado'})
            return
        }

        sendJSONresponse(res,200,{searchUser})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })
}

module.exports.searchUserByFullName = function(req,res) {
    const userId = req.user.id
    const primerNombre = removeSpanishChars(req.query.primerNombre)
    const apellidoPaterno = removeSpanishChars(req.query.apellidoPaterno)
    const apellidoMaterno = removeSpanishChars(req.query.apellidoMaterno)

    if(!userId || !primerNombre || !apellidoPaterno || !apellidoMaterno) {
        sendJSONresponse(res,404,{message:'Ingresa todos los campos requeridos'})
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
        
        if(!user) {
            sendJSONresponse(res,404,{message:'Your account does not exist or does not have enough privileges'})
            return
        }

        let searchUser = await User.findAll({    
            where: {
                accountType: {
                    [Op.not]: 'admin'
                }
            },  
            attributes: ['id', 'email', 'phone', 'countryCode', 'email', 'nationality', 'accountType', 'accountLevel', 'createdAt'],                  
            include: [
                {
                    model: UserProfile,                    
                    where: {
                        primerNombre: {
                            [Op.like]: '%' + primerNombre + '%'
                        },
                        apellidoPaterno: {
                            [Op.like]: '%' + apellidoPaterno + '%',
                        },
                        apellidoMaterno: {
                            [Op.like]: '%' + apellidoMaterno + '%'
                        }
                    },
                }
            ], 
            limit: 10,
            transaction: t
        })

        if(!searchUser) {
            sendJSONresponse(res,404,{message:'El usuario no fue encontrado'})
            return
        }

        sendJSONresponse(res,200,{searchUser})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })
}

module.exports.getUserProfile = function(req,res) {
    const adminId = req.user.id
    const userId = req.params.userId

    if(!adminId || !userId) {
        sendJSONresponse(res,404,{message: "Ingresa todos los campos requeridos"});
        return
    }

    sequelize.transaction(async (t) => {
        let admin = await User.findOne({
            where: {
                id: adminId,
                accountType: 'admin',
                accoutLevel: {
                    [Op.gte]: 1
                }
            },
            transaction: t
        })

        if(!admin) {
            sendJSONresponse(res,404,{message:'Your account does not exist or does not have enough privileges'})
            return
        }

        let user = await User.findOne({
            where: {
                id: userId,
            },
            attributes: ['id', 'email', 'phone', 'countryCode', 'email', 'nationality', 'accountType', 'accountLevel', 'createdAt'],
            include: [
                {
                    model: UserProfile
                },
                {
                    model: CompanyProfile,
                },
                {
                    model: Address
                },
                {
                    model: Location
                },
                {
                    model: Document,                    
                },
                {
                    model: Transaction
                },
                {
                    model: Balance
                },
                {
                    model: Fees
                },

            ]
        })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })
}