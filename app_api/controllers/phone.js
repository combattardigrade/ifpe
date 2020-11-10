const User = require('../models/sequelize').User
const AuthRequest = require('../models/sequelize').AuthRequest
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')
const sendJSONresponse = require('../../utils/index').sendJSONresponse

// can only save phone if phone hasn't been verified
module.exports.savePhone = function(req,res) {
    const userId = req.user.id
    const phone = req.body.phone
    const countryCode = req.body.countryCode
    const code = Math.floor(100000 + Math.random() * 900000)

    if(!userId || !phone || !countryCode) {
        sendJSONresponse(res,422,{message:'Ingresa todos los campos requeridos'})
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,
                phoneVerified: 0
            },
            transaction: t
        })

        if(!user) {
            sendJSONresponse(res,404,{message:'El usuario no existe o ya cuenta con un número celular registrado'})
            return
        }

        let authRequest = await AuthRequest.findOne({
            where: {
                userId,
                action: 'verifyPhone',
                used:0,
                exp:{
                    [Op.gte]: moment().toDate()
                },
            },
            transaction: t
        })

        if(!authRequest) {
            let newRequest = await AuthRequest.create({
                userId,
                action: 'verifyPhone',
                used:0,
                exp: moment().add(5, 'minutes').toDate(),
                code,
            }, {transaction: t})
            if(newRequest) {
                // send code through sms
                sms.message.sendSms(process.env.COMPANY_NAME, countryCode + phone, 'Tu código de verificación es: ' + code)

                // save phone and countryCode
                user.phone = phone
                await user.save({transaction: t})

                // send response
                sendJSONresponse(res,200,'Verifica tu teléfono ingresando el código que enviamos a tu celular')
                return
            }
        }

        // authRequest found so don't resend the code here
        // send 200 response
        sendJSONresponse(res,200,{message:'Verifica tu teléfono ingresando el código que enviamos a tu celular'})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message:'Ocurrió un error al intentar realizar la operación'})
            return
        })
}

// verify phone number
module.exports.verifyPhone = (req,res) => {
    const phone = req.body.phone
    const code = req.body.code

    if(!phone || !code) {
        sendJSONresponse(res,422,{message: 'Completa todos los campos requeridos'})
        return
    }

    sequelize.transaction(async(t) => {
        let user = await User.findOne({
            where: {
                phone
            },
            attributes: ['id','phone','phoneVerified'],
            transaction: t
        })

        if(!user) {
            sendJSONresponse(res, 404, {message: 'El usuario no existe'})
            return
        }

        let authRequest = await AuthRequest.findOne({
            where: {
                userId: user.id,
                action: 'verifyPhone',
                used: 0,
                exp: {
                    [Op.gte]: moment().toDate()
                },
            },
            transaction: t
        })

        if(!authRequest) {
            sendJSONresponse(res,404,{message:'El código de verificación es incorrecto o expiró.'})
            return
        }

        // mark authRequest as used
        authRequest.used = 1
        await authRequest.save({transaction: t})

        // change phoneVerified to 1
        user.phoneVerified = 1
        user.save({transaction: t})

        // send response
        sendJSONresponse(res,200,{message: 'Teléfono celular confirmado correctamente'})
        return

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })
}
