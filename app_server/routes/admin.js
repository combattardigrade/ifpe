const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
    secret: process.env.JWT_SECRET,
    getToken: function(req) {
        if(req.cookies.token !== undefined) {
            return req.cookies.token
        } else {
            throw new Error('missing_token_cookie')
        }
    }
})

const Recaptcha = require('express-recaptcha').Recaptcha
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)



const authController = require('../controllers/authentication')
const adminController = require('../controllers/admin')

router.get('/login', authController.renderLogin)
router.post('/login', authController.login)
router.get('/checkAuth', auth, authController.checkAuth)
router.get('/*', adminController.renderAdminApp)

module.exports =  router