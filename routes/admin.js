const express =  require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const upload =  require('../middleware/multer')
const { ensureAdmin, ensureAuth} = require('../middleware/auth')


router.get('/', ensureAdmin, adminController.getIndex)
router.post('/createAccount', upload.single('file'), adminController.createAccount)
router.get('/fetch/user/:id', ensureAdmin, adminController.getUser)
router.post('/find/user', ensureAdmin, adminController.findUser)
router.get('/account/user/:id', ensureAdmin, adminController.getAccount)
router.delete('/delete/user/:id', ensureAdmin, adminController.deleteAccount)
router.post('/account/editAccount/:id', ensureAdmin, adminController.editAccount)
router.post('/deposit/user/:id', ensureAdmin, adminController.updateBalance)
router.post('/updatestatus/:id', ensureAdmin, adminController.updatestatus)
router.get('/account', adminController.createaccount)
router.get('/createcodes', ensureAdmin, adminController.getcodes)
router.get('/create', ensureAuth, adminController.createcode)
router.put('/activatecode/:id', ensureAuth, adminController.activatebilling)
router.put('/deactivatecode/:id', ensureAdmin, adminController.deactivatebilling)
router.get('/expirestatus/:id', adminController.setstatus)
router.get('/renewstatus/:id', ensureAdmin, adminController.deactivatestatus)
router.delete('/deletecode/:id', ensureAdmin, adminController.deletecode)
router.post('/debit/user/:id', ensureAdmin, adminController.debitaccount)
router.get('/transactions', ensureAdmin, adminController.fetchtransactions)
router.get('/reverse/:id', ensureAdmin, adminController.reversetransaction)
router.get('/reverse/user/:id/:userId', ensureAdmin, adminController.reverseusertransaction)



module.exports = router