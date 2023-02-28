const express = require('express')
const app =  express()
const logger = require('morgan')
const mainIndex = require('./routes/main')
const adminRoute = require('./routes/admin')
const mongoose = require('mongoose')
const connectDB =  require('./config/database')

require('dotenv').config({ path : './config/.env'})

connectDB()




// SETTING APP MIDDLEWARES

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded( { extended : true}))
app.use(express.json())
app.use(logger("dev"))


app.use("/", mainIndex)
app.use('/admin', adminRoute)


app.listen(process.env.PORT, () => {
    console.log('Server is running')
})