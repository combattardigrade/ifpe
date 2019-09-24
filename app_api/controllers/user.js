const User = require('../models/sequelize').User
const UserProfile = require('../models/sequelize').UserProfile
const UserAddress = require('../models/sequelize').UserAddress
const sequelize = require('../models/sequelize').sequelize

const sendJSONresponse = require('../../utils/index').sendJSONresponse

module.exports.saveNaturalPersonData = (req, res) => {
    const userId = req.user.id
    const primerNombre = req.body.primerNombre
    const segundoNombre = req.body.segundoNombre
    const apellidoPaterno = req.body.apellidoPaterno
    const apellidoMaterno = req.body.apellidoMaterno
    const gender = req.body.gender    
    const dateOfBirth = req.body.dateOfBirth
    const stateOfBirth = req.body.stateOfBirth
    const countryOfBirth = req.body.countryOfBirth
    const occupation = req.body.occupation
    const sourceOfResources = req.body.sourceOfResources

    if(!userId || !primerNombre || !apellidoPaterno || !apellidoMaterno 
        || !gender || !dateOfBirth || !stateOfBirth || !countryOfBirth
        || !occupation || !sourceOfResources) {
        sendJSONresponse(res, 422, {message: 'Ingresa todos los campos requeridos'})
        return
    }

    // check gender
    if(!(gender === 'M' || gender === 'F')){
        sendJSONresponse(res,404,{message: 'Ingresa un género'})
    }    

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId,     
                accountLevel: 0           
            },
            transaction: t
        })

        if(!user) {
            sendJSONresponse(res,404,{message: 'El usuario no existe o ya ha ingresado los datos de identificación personal'})
            return
        }

        // add country check in db

        // check occupation and source of resources in db

        return UserProfile.findOrCreate({
            where: {
                userId
            },
            defaults: {
                userId,
                primerNombre,
                segundoNombre,
                apellidoPaterno,
                apellidoMaterno,
                gender,
                dateOfBirth,
                stateOfBirth,
            },
            transaction: t
        })
            .spread((user, created) =>{
                if(!created) {
                    sendJSONresponse(res,404,{message: 'Los datos de identificación ya han sido ingresados'})
                    return
                }

                sendJSONresponse(res,200,{message: 'Datos guardados correctamente'})
                return
            })        
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })
}

module.exports.saveAddress = (req,res) => {
    const userId = req.user.id
    const calle = req.body.calle
    const ext = req.body.ext
    const int = req.body.int
    const codigoPostal = req.body.codigoPostal
    const asentamiento = req.body.asentamiento
    const municipio = req.body.municipio
    const estado = req.body.estado
    const ciudad = req.body.ciudad
    const pais = req.body.pais

    if(!userId || !calle || !ext  || !codigoPostal || !asentamiento || !municipio || !estado || !ciudad || !pais) {
        sendJSONresponse(res,404,{message: 'Ingresa todos los campos requeridos'})
        return
    }

    sequelize.transaction(async(t) => {
        let user = await User.findOne({
            where: {
                id: userId
            },
            transaction: t
        })

        if(!user) {
            sendJSONresponse(res,404,{message: 'El usuario no existe'})
            return
        }

        UserAddress.findOrCreate({
            where: {
                userId,
            },
            defaults: {
                userId,
                calle,
                ext,
                int,
                codigoPostal,
                asentamiento,
                municipio,
                estado,
                ciudad,
                pais
            },
            transaction: t
        })
            .spread((UserProfile, created) => {
                if(!created) {
                    sendJSONresponse(res,404,{message: 'Los datos ya han sido ingresados'})
                    return
                }
                sendJSONresponse(res,200,{message: 'Datos guardados correctamente'})
                return
            })

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res,404,{message: 'Ocurrió un error al intentar realizar la operación'})
            return
        })
}