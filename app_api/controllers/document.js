const User = require('../models/sequelize').User
const Document = require('../models/sequelize').Document
const sequelize = require('../models/sequelize').sequelize

const sendJSONresponse = require('../../utils/index').sendJSONresponse
const { Op } = require('sequelize')
const moment = require('moment')
const crypto = require('crypto')
const fs = require('fs')

module.exports.uploadDocument = function (req, res) {
    const userId = req.user.id
    const documentName = req.body.documentName
    const documentData = req.body.documentData

    if (!userId || !documentName || !documentData) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
        return
    }

    sequelize.transaction(async (t) => {
        let user = await User.findOne({
            where: {
                id: userId
            },
            transaction: t
        })

        if (!user) {
            sendJSONresponse(res, 404, { message: 'El usuario no existe' })
            return
        }

        let documentBuffer = new Buffer(documentData, 'base64')
        let newName = crypto.randomBytes(16).toString('hex')
        let hash = crypto.randomBytes(16).toString('hex')
        let filePath = './uploads/documents/' + newName + '.jpeg'

        try {
            fs.writeFile(filePath, documentBuffer, function () {
                // save document record in db
                Document.create({
                    userId,
                    name: documentName,
                    hash,
                    filePath: filePath,
                    status: 'in_review'
                }, { transaction: t })
                    .then((document) => {
                        if (!document) {
                            sendJSONresponse(res, 404, { message: 'Error uploading file' })
                            return
                        }
        
                        sendJSONresponse(res, 200, { message: 'Documento subido correctamente' })
                        return
                    })                
            })
        }
        catch (err) {
            console.log('Error: ' + error)
        }

    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}


// Only admins can view documents
module.exports.getDocument = function (req, res) {
    
    const documentHash = req.params.documentHash
    
    if (!documentHash) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
    }
   
    sequelize.transaction(async (t) => {
            
        let document = await Document.findOne({
            where: {
                hash: documentHash
            },
            transaction: t
        })

        if (!document) {
            sendJSONresponse(res, 404, { message: 'Documento no encontrado' })
            return
        }

        fs.readFile(document.filePath, function (err, data) {
            if (err) {
                sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar obtener el documento' })
                return
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
            res.end(data, 'binary')
        })
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.approveDocument = function (req, res) {
    const userId = req.user.id
    const documentId = parseInt(req.body.documentId)

    if (!userId || !documentId) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
    }

    if (isNaN(documentId)) {
        sendJSONresponse(res, 404, { message: 'Ingresa un identificador de documento correcto' })
        return
    }

    sequelize.transaction(async (t) => {
        let admin = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                },
            },
            transaction: t
        })

        if(!admin) {
            sendJSONresponse(res, 404, { message: 'La cuenta de administrador no existe o no tiene suficientes privilegios para ver el documento' })
            return
        }

        let document = await Document.findOne({
            where: {
                id: documentId
            },
            transaction: t
        })

        if (!document) {
            sendJSONresponse(res, 404, { message: 'Documento no encontrado' })
            return
        }

        document.status = 'approved'
        await document.save({transaction: t})

        sendJSONresponse(res,200,{message: 'Documento aprobado correctamente'})
        return
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}

module.exports.disapproveDocument = function(req,res) {
    const userId = req.user.id
    const documentId = parseInt(req.body.documentId)

    if (!userId || !documentId) {
        sendJSONresponse(res, 404, { message: 'Ingresa todos los campos requeridos' })
    }

    if (isNaN(documentId)) {
        sendJSONresponse(res, 404, { message: 'Ingresa un identificador de documento correcto' })
        return
    }

    sequelize.transaction(async (t) => {
        let admin = await User.findOne({
            where: {
                id: userId,
                accountType: 'admin',
                accountLevel: {
                    [Op.gte]: 1
                },
            },
            transaction: t
        })

        if(!admin) {
            sendJSONresponse(res, 404, { message: 'La cuenta de administrador no existe o no tiene suficientes privilegios para ver el documento' })
            return
        }

        let document = await Document.findOne({
            where: {
                id: documentId,
                status: 'in_review'
            },
            transaction: t
        })

        if (!document) {
            sendJSONresponse(res, 404, { message: 'El documento no fue encontrado o ya no se encuentra en revisión' })
            return
        }

        // delete file from system
        fs.unlink(document.filePath, function(err, data) {
            if(err) {
                sendJSONresponse(res,404,{message: 'Error al intentar rechazar el documento'})
                return
            }
            // delete document record from db
            document.destroy({transaction: t})
            // To do:
            // 1) send email to client

            sendJSONresponse(res,404,{message: 'Documento rechazado correctamente'})
            return
        }) 
        
    })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, { message: 'Ocurrió un error al intentar realizar la operación' })
            return
        })
}