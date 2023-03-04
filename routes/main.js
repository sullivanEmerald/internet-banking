const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

// get controller for the main routes
const mainController = require('../controllers/main')


// Applying Crud operation on the main routes 
router.get('/', mainController.getIndex)
router.get('/invest', mainController.getIvest)
router.get('/loan', mainController.getLoan)
router.get('/insurance', mainController.getInsurance)
router.get('/save', mainController.getSave)
router.get('/contact', mainController.getContact)
router.get('/user/signup', mainController.getUser)


// Routes for login and Sign up


router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);





module.exports = router
