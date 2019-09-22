const User = require('../models/sequelize').User
const { Op } = require('sequelize')
const sendJSONresponse = require('../../utils/index').sendJSONresponse


module.exports.checkPrivileges = function(req,res) {
    const userId = req.user.id

    if(!userId) {
        sendJSONresponse(res,404,{message: 'Ingresa todos los campos requeridos'})
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
        attributes: ['id','email','accountType','accountLevel']
    })
        .then((user) => {
            if(!user) {
                sendJSONresponse(res,401,{message: 'Your account does not have enough privileges'})
                return
            }

            sendJSONresponse(res,200,{message:'AUTHORIZED',user})
            return
        })
}