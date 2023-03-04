const express = require('express')
const app =  express()
const logger = require('morgan')
const methodOveride =  require('method-override')
const passport =  require('passport')
const session =  require("express-session")
const flash =  require('express-flash')
const MongoStore =  require('connect-mongo')
const mainIndex = require('./routes/main')
const adminRoute = require('./routes/admin')
const mongoose = require('mongoose')
const connectDB =  require('./config/database')

require('dotenv').config({ path : './config/.env'})

require('./config/passport')(passport)

connectDB()


// SETTING APP MIDDLEWARES

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded( { extended : true}))
app.use(express.json())
app.use(logger("dev"))
app.use(methodOveride('_method'))


app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl : process.env.DB_STRING
    })
}))


app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use("/", mainIndex)
app.use('/admin', adminRoute)


app.listen(process.env.PORT, () => {
    console.log('Server is running')
})