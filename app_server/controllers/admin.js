
const fetch = require('node-fetch')
const sendJSONresponse = require('../../utils/index').sendJSONresponse
const API_HOST = process.env.API_HOST
const rp = require('request-promise')

module.exports.renderAdminApp = function (req, res) {

    try {
        res.sendFile(APP_ROOT + '/public/admin.html')
    }
    catch (e) {
        console.log(e)
    }

    return
}

module.exports.getUnusualOperation = function (req, res) {
    const operationId = parseInt(req.params.operationId)

    rp({
        uri: API_HOST + '/pld/unusualOperation/' + operationId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            sendJSONresponse(res, 200, response)
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, err)
        })
}

module.exports.getUnusualOperations = function (req, res) {

    const status = req.params.status ? req.params.status : 'all'
    const page = req.params.page ? parseInt(req.params.page) : 1

    rp({
        uri: API_HOST +
            '/pld/unusualOperations/' + status + '/' + page,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            sendJSONresponse(res, 200, response)
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, err)
        })
}

module.exports.getUsersByTypeAndLevel = function (req, res) {

    const accountType = req.query.accountType ? req.query.accountType : 'all'
    const accountLevel = req.query.accountLevel ? parseInt(req.query.accountLevel) : 0
    const accountLevelGte = req.query.accountLevelGte ? parseInt(req.query.accountLevelGte) : 0
    const page = req.query.page ? parseInt(req.query.page) : 1

    rp({
        uri: API_HOST +
            '/admin/getUsersByTypeAndLevel?accountType=' +
            accountType + '&accountLevel=' + accountLevel +
            '&accountLevelGte=' + accountLevelGte + '&page=' + page,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            sendJSONresponse(res, 200, response)
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, err)
        })
}

module.exports.searchUserByEmail = function (req, res) {
    const email = req.query.email

    rp({
        uri: API_HOST +
            '/admin/searchUserByEmail?email=' + email,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            sendJSONresponse(res, 200, response)
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, err)
        })
}

module.exports.searchUserByFullName = function (req, res) {
    const primerNombre = req.query.primerNombre
    const apellidoPaterno = req.query.apellidoPaterno
    const apellidoMaterno = req.query.apellidoMaterno

    rp({
        uri: API_HOST +
            '/admin/searchUserByFullName?primerNombre=' + primerNombre
            + '&apellidoPaterno=' + apellidoPaterno + '&apellidoMaterno=' + apellidoMaterno,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            sendJSONresponse(res, 200, response)
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, err)
        })
}

module.exports.getClientProfile = function (req, res) {
    const userId = req.params.userId
    rp({
        uri: API_HOST +
            '/admin/getClientProfile/' + userId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            sendJSONresponse(res, 200, response)
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, err)
        })
}

module.exports.getDocument = function (req, res) {
    const documentId = parseInt(req.params.documentId)
    console.log('test')
    rp({
        uri: API_HOST +
            '/document/' + documentId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.token
        },
        json: true
    })
        .then((response) => {
            console.log(response)
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
            res.end(response, 'binary')
        })
        .catch((err) => {
            console.log(err)
            sendJSONresponse(res, 404, err)
        })

}

