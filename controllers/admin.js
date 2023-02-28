const accounts =  require('../model/accounts')
const cloudinary = require('../middleware/cloudinary')

// Function to generate 10 random number
function getAccount(){
    let number = []

    for(let i = 0; i < 6; i++ ){
        let result = Math.floor(Math.random() * 100) + 1;
        number.push(result);
    }
    
    number[0] = 5
    let acc =  number.join('')
    return acc
    
}


module.exports = {
    getIndex : async (req, res) => {
        try {
            res.render('admin/index.ejs' , { title : 'Admin Panel'})
        } catch (error) {
            console.error(error)
        }
    },

    createAccount  : async (req, res) => {
        try {
            const result = await cloudinary.uploader.upload(req.file.path)
            await accounts.create({
                username : req.body.username,
                middlename  : req.body.middlename,
                lastname : req.body.lastname,
                mobile  : req.body.phone,
                dateOfBirth : req.body.date,
                email : req.body.email,
                gender : req.body.gender,
                occupation : req.body.occupation,
                address : req.body.address,
                nation  : req.body.nationality,
                state : req.body.state,    
                landmark : req.body.landmark,
                kin  : req.body.kinName,
                relationship  : req.body.relationship,
                kinMobile  : req.body.kinPhone,
                Kinaddress  : req.body.kinaddress,
                balance  : req.body.depoist,
                ownerImage : result.secure_url,
                cloudinaryId : result.public_id,
                accountNumber : getAccount()
            })
            console.log('successfully uploaded')

            const accLength =  await accounts.find().lean()
            const acc = accLength[accLength.length - 1]
            console.log(acc)

            res.redirect(`/admin/fetch/user/${acc._id}`)

        } catch (error) {
            console.error(error)
        }
    },

    getUser : async (req, res) => {
        try {
            const userAccount = await accounts.findById(req.params.id)
            res.render('admin/user.ejs', { title : userAccount.username , user : userAccount})
        } catch (error) {
            console.error(error)
        }
    },

    findUser : async (req, res) => {
        try {
            const user = await accounts.findOne({ accountNumber : req.body.account})
            res.redirect(`/admin/account/user/${user._id}`)
        } catch (error) {
            console.error(error)
        }
    },

    getAccount : async (req, res) => {
        try {
            const user = await accounts.findById(req.params.id)
            res.render('admin/user.ejs', { title : user.username, user : user})
        } catch (error) {
            console.error(error)
        }
    }
}