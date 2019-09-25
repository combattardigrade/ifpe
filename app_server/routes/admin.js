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

const Recaptcha = require('express-recaptcha').RecaptchaV3
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)


const authController = require('../controllers/authentication')
const adminController = require('../controllers/admin')

router.get('/login', authController.renderLogin)
router.post('/login', recaptcha.middleware.verify, authController.login)
router.get('/checkAuth', auth, authController.checkAuth)
router.get('/checkPrivileges', auth, authController.checkPrivileges)
router.get('/getUsersByTypeAndLevel', auth, adminController.getUsersByTypeAndLevel)
router.get('/searchUserByEmail', auth, adminController.searchUserByEmail)
router.get('/searchUserByFullName', auth, adminController.searchUserByFullName)
router.get('/getClientProfile/:userId', auth, adminController.getClientProfile)
router.get('/document/:documentId', auth, adminController.getDocument)
router.get('/*', adminController.renderAdminApp)

module.exports =  router