const express = require('express')
const router = express.Router()

// get controller for the main routes
const mainController = require('../controllers/main')


// Applying Crud operation on the main routes 
router.get('/', mainController.getIndex)
router.get('/invest', mainController.getIvest)


module.exports = router
