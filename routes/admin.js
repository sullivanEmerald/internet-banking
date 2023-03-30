const express =  require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const upload =  require('../middleware/multer')
const { ensureAdmin} = require('../middleware/auth')


router.get('/', ensureAdmin, adminController.getIndex)
router.post('/createAccount', ensureAdmin, upload.single('file'), adminController.createAccount)
router.get('/fetch/user/:id', ensureAdmin, adminController.getUser)
router.post('/find/user', ensureAdmin, adminController.findUser)
router.get('/account/user/:id', ensureAdmin, adminController.getAccount)
router.delete('/delete/user/:id', ensureAdmin, adminController.deleteAccount)
router.post('/account/editAccount/:id', ensureAdmin, adminController.editAccount)
router.post('/deposit/user/:id', ensureAdmin, adminController.updateBalance)


module.exports = router