const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/sequelize').User
const AuthRequest = require('../models/sequelize').AuthRequest
const emailController = require('../controllers/email')
const moment = require('moment')

passport.use(new localStrategy({
    usernameField: 'email'
},
    function(username, password, done) {
        User.findOne({
            where: {
                email: username
            }
        })
            .then((function(user) {
                // check if user exists
                if(!user) {
                    return done(null, false, {
                        message: 'El usuario no existe o la contraseña es incorrecta'
                    })
                }
                // check if password is correct
                if(!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'El usuario no existe o la contraseña es incorrecta'
                    })
                }

                // check email verification
                if(user.emailVerified === 0) {
                    // check if new verification code must be created
                    return done(null, false, {
                        message: 'Verifica tu email ingresando el código que enviamos a tu cuenta'
                    })
                    // send verification code
                    
                    
                }

                // generate jwt token
                const token = user.generateJwt()
                return done(null, token)
            }))
    }    
))