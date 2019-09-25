const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
    secret: process.env.JWT_SECRET,
})

const authenticationController = require('../controllers/authentication')
const phoneController = require('../controllers/phone')
const locationController = require('../controllers/location')
const documentController = require('../controllers/document')
const adminController = require('../controllers/admin')


// authentication
router.post('/signup', authenticationController.signup)
router.post('/verifyEmail', authenticationController.verifyEmail)
router.post('/login', authenticationController.login)

// phone
router.post('/phone', auth, phoneController.savePhone)
router.post('/verifyPhone', phoneController.verifyPhone)

// gps location
router.post('/location', auth, locationController.saveLocation )

// admin
router.get('/admin/checkPrivileges', auth, adminController.checkPrivileges)
router.get('/admin/getUsersByTypeAndLevel', auth, adminController.getUsersByTypeAndLevel)
router.get('/admin/searchUserByEmail', auth, adminController.searchUserByEmail)
router.get('/admin/searchUserByFullName', auth, adminController.searchUserByFullName)
router.get('/admin/getClientProfile/:userId', auth, adminController.getClientProfile)

// documents
router.get('/document/:documentHash', documentController.getDocument)
router.post('/document', auth, documentController.uploadDocument)
router.put('/document', auth, documentController.approveDocument)
router.delete('/document', auth, documentController.disapproveDocument)

module.exports = router