
const fetch = require('node-fetch')
const sendJSONresponse = require('../../utils/index').sendJSONresponse
const API_HOST = process.env.API_HOST

module.exports.isAuthenticated = function(req,res) {
    sendJSONresponse(res,200,{message: 'AUTHENTICATED'})
    return
}


module.exports.renderLogin = function(req,res) {
    sendJSONresponse(res,200,{csrf: req.csrfToken(),msg:"test"})
    return
}

module.exports.login = function(req,res) {
    const email = req.body.email
    const password = req.body.password    
   
    fetch(API_HOST + '/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email, password: password}),
    })
        .then(response => response.json())
        .then((response) => {
            console.log(response)
            if(response.message) {
                sendJSONresponse(res,200,response)
                return 
            }
            // set cookie
            res.cookie('token', response.token, {httpOnly: true, secure: process.env.NODE_ENV == 'production'})
            sendJSONresponse(res,200,{ token: response.token})
            return
        })      
    
}