const express = require('express')
const app =  express()
const logger = require('morgan')
const mainIndex = require('./routes/main')




// SETTING APP MIDDLEWARES

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded( { extended : true}))
app.use(express.json())
app.use(logger("dev"))


app.use("/", mainIndex)


app.listen(3000, () => {
    console.log('app is running and listeninng to the Api')
})