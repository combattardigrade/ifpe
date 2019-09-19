const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
    secret: process.env.JWT_SECRET,
})

const authenticationController = require('../controllers/authentication')

// authentication
router.post('/signup', authenticationController.signup)
router.post('/verifyEmail', authenticationController.verifyEmail)
router.post('/login', authenticationController.login)

module.exports = router