const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
    secret: process.env.JWT_SECRET,
})

const authenticationController = require('../controllers/authentication')
const phoneController = require('../controllers/phone')
const locationController = require('../controllers/location')

// authentication
router.post('/signup', authenticationController.signup)
router.post('/verifyEmail', authenticationController.verifyEmail)
router.post('/login', authenticationController.login)

// phone
router.post('/phone', auth, phoneController.savePhone)
router.post('/verifyPhone', phoneController.verifyPhone)

// gps location
router.post('/location', auth, locationController.saveLocation )

module.exports = router