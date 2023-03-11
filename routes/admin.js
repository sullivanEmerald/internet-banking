const express =  require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const upload =  require('../middleware/multer')


router.get('/', adminController.getIndex)
router.post('/createAccount', upload.single('file'), adminController.createAccount)
router.get('/fetch/user/:id', adminController.getUser)
router.post('/find/user', adminController.findUser)
router.get('/account/user/:id', adminController.getAccount)
router.delete('/delete/user/:id', adminController.deleteAccount)
router.post('/account/editAccount/:id', adminController.editAccount)
router.post('/deposit/user/:id', adminController.updateBalance)


module.exports = router