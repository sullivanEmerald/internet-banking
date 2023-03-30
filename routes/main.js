const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

// get controller for the main routes
const mainController = require('../controllers/main')

// Checking the user to Authenticated before accessing some routes

const { ensureAuth } = require('../middleware/auth')


// Applying Crud operation on the main routes 
router.get('/', mainController.getIndex)
router.get('/invest', mainController.getIvest)
router.get('/loan', mainController.getLoan)
router.get('/insurance', mainController.getInsurance)
router.get('/save', mainController.getSave)
router.get('/contact', mainController.getContact)
router.get('/search', ensureAuth,  mainController.getUser)
router.post('/find/user', ensureAuth,  mainController.findUser)
router.get('/user/profile/:id', ensureAuth, mainController.getProfie )
router.get('/dashboard/:id', ensureAuth, mainController.getdashboard)
router.get('/transfer/:id', ensureAuth, mainController.getTransfer)
router.post('/myaccount/transfer/:id', ensureAuth, mainController.transferMoney)
router.post('/myaccount/transfer/reciever/:id', ensureAuth, mainController.postTransfer)
router.get('/user/confirm/:id', ensureAuth, mainController.transactionDetails)
router.get('/edit/history/:id', ensureAuth, mainController.getHistory)
router.post('/transfer/confirm/:id', ensureAuth, mainController.correctHistory)
router.delete('/delete/transaction/:id/:acc', ensureAuth, mainController.deleteTransaction)
router.get('/confirm/:id', ensureAuth, mainController.confirm)
router.get('/transfer/send/:id', ensureAuth, mainController.gotoTransfer)
router.get('/view/transaction/:id/:acc', ensureAuth, mainController.viewTransaction)
router.get('/user/transactions/:id', ensureAuth, mainController.fetchTransactions)
router.get('/pandemic', ensureAuth, mainController.getPandemicInfo)



// Routes for login and Sign up
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);







module.exports = router
