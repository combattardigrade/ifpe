const passport = require('passport')
const User = require('../models/sequelize').User
const AuthRequest = require('../models/sequelize').AuthRequest
const sequelize = require('../models/sequelize').sequelize
const emailController = require('./email')
const crypto = require('crypto')
const sendJSONresponse = require('../../utils/index').sendJSONresponse
const checkSequentialCharacters = require('../../utils/index').checkSequentialCharacters
const { Op } = require('sequelize')
const emailValidator = require('email-validator')
const moment = require('moment')

module.exports.signup = function (req, res) {
    const email = req.body.email
    const password = req.body.password
    const rpassword = req.body.rpassword
    
    // check if all field were sent
    if (!email || !password || !rpassword) {
        sendJSONresponse(res, 422, { message: 'Completa todos los campos requeridos' })
        return
    }

    // check that the passwords are the same
    if (password !== rpassword) {
        sendJSONresponse(res, 422, { message: 'Las contraseñas ingresadas no coinciden' })
        return
    }

    // check password strength
    // At keast 6 characteres long, max length anything
    // Include at least 1 lower case letter
    // 1 number
    // 1 special character => !@#$%^&*
    if (!(/^(?=.*[\d])(?=.*[a-z])(?=.*[!@#$%^&*.?+-:;])[\w!@#$%^&*.?+-:;]{8,}$/.test(password))) {
        sendJSONresponse(res, 422, { message: 'Tu contraseña debe contener al menos una letra, un número, un caracter especial y tener un mínimo de 8 caracteres de largo' })
        return
    }

    // password must not be the client identifier
    if (email === password || password.search(email) > 0) {
        sendJSONresponse(res, 422, { message: 'Tu contraseña no puede ser igual al email asociado a la cuenta' })
        return
    }

    // password must not containt the company's name
    if (password === process.env.COMPANY_NAME || password.search(process.env.COMPANY_NAME) > 0) {
        sendJSONresponse(res, 422, { message: 'Tu contraseña no puede contener el nombre de la empresa' })
        return
    }

    // password must not contain more than 3 sequential alphabetic or numerical numbers 
    // check that none of the characters repeat more than twice
    if (!checkSequentialCharacters(password)) {        
        sendJSONresponse(res, 422, { message: 'Tu contraseña no puede contener más de tres caracteres numéricos o alfabéticos en forma secuencial o identicos en forma consecutiva' })
        return
    }
    
    // check if email is valid
    if (!emailValidator.validate(email)) {
        sendJSONresponse(res, 404, { message: 'Ingresa un email válido' })
        return
    }

    sequelize.transaction(function (t) {
        return User.findOrCreate({
            where: {
                email: email
            },
            transaction: t
        })
            .spread(function (user, created) {
                if (!created) {
                    sendJSONresponse(res, 404, { message: 'El email ingresado ya se encuentra registrado' })
                    return
                }

                user.setPassword(password)
                // const token = user.generateJwt()
                return user.save({ transaction: t })
                    .then(function () {
                        // email verification request
                        return AuthRequest.create({
                            userId: user.id,
                            action: 'verifyEmail',
                            code: Math.floor(100000 + Math.random() * 900000),
                            exp: moment().add(5, 'minutes').toDate(),
                            used: 0
                        }, { transaction: t })
                            .then(function (authRequest) {
                                if (!authRequest) {
                                    sendJSONresponse(res, 404, { message: 'Error al intentar realizar la operación' })
                                    return
                                }

                                // send verification code to email account

                                sendJSONresponse(res, 200, { message: 'Verifica tu email ingresando el código que enviamos a tu cuenta' })
                                return
                            })
                    })


            })
    })
        .catch(function (err) {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Error al intentar realizar la operación' })
            return
        })
}

module.exports.verifyEmail = function (req, res) {
    const email = req.body.email
    const code = req.body.code

    if (!email || !code) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let authRequest = await AuthRequest.findOne({
            where: {
                action: 'verifyEmail',
                code: code,
                exp:{
                    [Op.gte]: moment().toDate()
                },
                used: 0
            },
            include: [
                {
                    model: User,
                    attributes: ['id','email','emailVerified']
                }
            ],
            transaction: t
        })

        if(!authRequest) {
            sendJSONresponse(res,404,{message: 'El código de verificación ya fue usado o es incorrecto'})
            return
        }
        
        // check email
        if(email !== authRequest.user.email) {
            sendJSONresponse(res,404,{message: 'El código de verificación ya fue usado o es incorrecto'})
            return
        }

        authRequest.used = 1
        await authRequest.save({transaction: t})
        // verify email
        authRequest.user.emailVerified = 1
        await authRequest.user.save({transaction: t})
        sendJSONresponse(res,200,{message: 'Email verificado correctamente'})
        return

    })
        .catch((err) => {
            sendJSONresponse(res,404,{message: 'Error al intentar realizar la operación'})
            console.log(err)
            return
        })
}

module.exports.login = function (req, res) {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    passport.authenticate('local', function (err, token, info) {
        if (err) {
            sendJSONresponse(res, 404, err)
            return
        }
        if (!token) {
            sendJSONresponse(res, 401, info)
            return
        }
        sendJSONresponse(res, 200, { token: token })
    })
}