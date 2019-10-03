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
router.get('/csrf', auth, authController.getCSRFToken)
router.post('/login', recaptcha.middleware.verify, authController.login)
router.get('/checkAuth', auth, authController.checkAuth)
router.get('/checkPrivileges', auth, authController.checkPrivileges)
router.get('/getUsersByTypeAndLevel', auth, adminController.getUsersByTypeAndLevel)
router.get('/searchUserByEmail', auth, adminController.searchUserByEmail)
router.get('/searchUserByFullName', auth, adminController.searchUserByFullName)
router.get('/getClientProfile/:userId', auth, adminController.getClientProfile)
router.get('/document/:documentId', auth, adminController.getDocument)

// pld
router.get('/pld/getUnusualOperations/:status/:page', auth, adminController.getUnusualOperations)
router.get('/pld/getUnusualOperation/:operationId', auth, adminController.getUnusualOperation)
router.post('/pld/sendUnusualOperationReport', auth, adminController.sendUnusualOperationReport)
router.post('/pld/generalListSearch', auth, adminController.generalListSearch)
router.get('/pld/getListByPage/:list/:page', auth, adminController.getListByPage)
router.post('/pld/addNameToList', auth, adminController.addNameToList)
router.get('/pld/getRiskFactors/:elemento/:page', auth, adminController.getRiskFactors)
router.put('/pld/editRiskFactor', auth, adminController.editRiskFactor)
router.get('/pld/reportes/:page', auth, adminController.getAllReportsByPage)
router.post('/pld/reporte', auth, adminController.createReport)
router.get('/pld/reporte/:reportId', auth, adminController.getReportOperations)
router.get('/*', adminController.renderAdminApp)

module.exports =  router