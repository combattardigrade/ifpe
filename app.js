require('dotenv').load()
const cors = require('cors')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const passport = require('passport')
const fileUpload = require('express-fileupload')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')

require('./app_api/config/passport')
const routesAdmin = require('./app_server/routes/admin')
const routesApi = require('./app_api/routes/index')
const app = express()

app.use(cors({origin: '*',credentials: true , origin: 'http://localhost:8080'}))
app.use(fileUpload({limits: {fileSize: 10 * 1024 * 1024}}))
app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(express.static(path.join(__dirname,'public')))

app.use(passport.initialize())
app.use('/api',routesApi)
// csrf and cookies
app.use(cookieParser())
app.use(csurf({cookie: {httpOnly: true}}))
app.use('/admin',routesAdmin)

// global variable
global.APP_ROOT = path.resolve(__dirname)

app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError') {
        res.status(401)
        res.json({message: 'Unauthorized user' })
    } else if (err.code === 'EBADCSRFTOKEN') {
        res.status(403)
        res.send('CSRF verification failed')
    } else if (err.message === 'missing_token_cookie') {
        res.status(401)
        res.json({message: 'User not authenticated' })
        res.end()
    }
})

if(process.env.NODE_ENV === 'production') {
    app.set('port', process.env.PORT || 3000)
    app.listen(app.get('port'), function() {
        console.log('Listening on port ' + app.get('port'))
    })
} else if (process.env.NODE_ENV === 'dev') {
    app.set('port', process.env.PORT || 3000)
    app.listen(app.get('port'), function() {
        console.log('Listening on port ' + app.get('port'))
    })
}

module.exports = app