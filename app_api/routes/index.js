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
const pldController = require('../controllers/pld')
const reporteController = require('../controllers/pld/reporte')

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

// pld
router.post('/pld/searchBlocked', auth, pldController.findBlockedPerson)
router.post('/pld/searchSanctioned', auth, pldController.findSanctionedPerson)
router.post('/pld/generalListSearch', auth, pldController.generalListSearch)
router.get('/pld/getListByPage/:list/:page', auth, pldController.getListByPage)
router.post('/pld/importPersonasBloqueadasFile', auth, pldController.importPersonasBloqueadasFile)
router.post('/pld/importPersonasSancionadasFile', auth, pldController.importPersonasSancionadasFile)
router.post('/pld/importOFACCountries', auth, pldController.importPaisesPersonasSancionadasFile)
router.post('/pld/riskMatrix', auth, pldController.addRiskFactor)
router.get('/pld/calculateInitialRisk/:userId', auth,  pldController.calculateInitialRisk)
router.get('/pld/unusualOperations/:status/:page', auth, pldController.getUnusualOperations)
router.get('/pld/unusualOperation/:operationId', auth, pldController.getUnusualOperation)
router.post('/pld/sendUnusualOperationReport', auth, pldController.sendUnusualOperationReport)
router.post('/pld/addNameToList', auth, pldController.addNameToList)
router.get('/pld/getRiskFactors/:elemento/:page', auth, pldController.getRiskFactors)
router.put('/pld/editRiskFactor', auth, pldController.editRiskFactor)

// pld => reporte
router.post('/pld/reporte', auth, reporteController.createReport)
router.get('/pld/reportes/:page', auth, reporteController.getAllReportsByPage)
router.get('/pld/reporte/:reportId', auth, reporteController.getReportOperations)
module.exports = router