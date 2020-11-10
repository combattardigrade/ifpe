const User = require('../models/sequelize').User
const UserLocation = require('../models/sequelize').UserLocation
const sequelize = require('../models/sequelize').sequelize
const { Op } = require('sequelize')
const moment = require('moment')
const sendJSONresponse = require('../../utils/index').sendJSONresponse

module.exports.saveLocation = (req,res) => {
    const userId = req.user.userId
    const lat = req.body.lat
    const lng = req.body.lng

    if(!userId || !lat || !lng) {
        sendJSONresponse(res,422,{message: 'Ingresa todos los campos requeridos'})
        return
    }
    
    sequelize.transaction(async(t) => {
        let user = await User.findOne({
            where: {
                id: userId
            }
        })

        if(!user) {
            sendJSONresponse(res,404,{message: 'El usuario no existe'})
            return
        }

        let userLocation = await UserLocation.create({
            userId,
            lat,
            lng
        },{transaction: t})

        if(!userLocation) {
            sendJSONresponse(res,404,{message: 'Error al intentar guardad la localización'})
            return
        }

        sendJSONresponse(res,200,{message: 'Localización guardada correctamente'})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })

}