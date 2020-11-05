const express = require('express')
require('dotenv').config()
require('./passport-auth/passport-setup')
const cookieSession = require('cookie-session')
const passport = require('passport')

const port = process.env.PORT

const isLoggedIn = (req, res, next) => {
    if(req.user) {
        next()
    } else {
        res.sendStatus(401)
    }
}

const app = express()

app.use(cookieSession({
    name: 'oauth-session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.send('You are not logged in')
})

app.get('/failed', (req, res) => {
    res.send('Your login failed')
})

app.get('/profile', isLoggedIn, (req, res) => {
    res.send(`Welcome to Profile ${req.user.displayName}. Your gmail ${req.user.emails[0].value}`)
})

app.get('/auth', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed'}), 
    (req, res) => {
        res.redirect('/profile')
    }
)

app.get('/logout', (req, res) => {
    req.session = null
    req.logout()
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`server upon running in ${port}`)
})