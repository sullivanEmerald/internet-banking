const accounts =  require('../models/accounts')
const cloudinary = require('../middleware/cloudinary');
const codes = require('../models/codes');
const { resolveInclude } = require('ejs');

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

// functions for generating codes

function cot(){
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return +result
}

function imf(){
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return +result
}

function tax(){
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return +result
}


module.exports = {
    getIndex : async (req, res) => {
        try {
            const users = await accounts.find().sort({cretedAt : 'desc'}).lean()
            console.log(users)
            res.render('admin/accounts.ejs' , { title : 'Admin Panel', user : users})
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
                mobile  : +req.body.phone,
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
                kinMobile  : +req.body.kinPhone,
                Kinaddress  : req.body.kinaddress,
                balance  : req.body.depoist,
                ownerImage : result.secure_url,
                cloudinaryId : result.public_id,
                accountNumber : getAccount(),
                active  : 'active'
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
            res.render('admin/found.ejs', { title : userAccount.username , user : userAccount})
        } catch (error) {
            console.error(error)
        }
    },

    findUser : async (req, res) => {
        try {
            const user = await accounts.findOne({ accountNumber : Number(req.body.account)})
            if(!user){
                res.json({ message : 'Account Not Found'}).status(404)
            }
            res.redirect(`/admin/account/user/${user._id}`)
        } catch (error) {
            console.error(error)
        }
    },

    getAccount : async (req, res) => {
        try {
            const user = await accounts.findById(req.params.id)
            res.render('admin/found.ejs', { title : user.username, user : user})
        } catch (error) {
            console.error(error)
        }
    },

    deleteAccount : async (req, res) => {
        try {
            await accounts.findOneAndDelete({ _id : req.params.id})
            console.log("Delete")
            res.redirect('/admin')
        } catch (error) {
            console.error(error)
        }
    },

    editAccount : async (req, res) => {
        try {
            await accounts.findOneAndUpdate({ _id : req.params.id }, {
                        username : req.body.username,
                        middlename : req.body.middlename,
                        lastname : req.body.lastname,
                        dateOfBirth : req.body.date,
                        email : req.body.email,
                        mobile : req.body.phone,
                        occupation : req.body.occupation,
                        address  : req.body.address,
                        nation : req.body.nation,
                        state :  req.body.state,
                        landmark : req.body.landmark,
                        kin  : req.body.kinName,
                        relationship  : req.body.relationship,
                        kinMobile  : req.body.kinPhone,
                        Kinaddress  : req.body.kinaddress
                    
            })
            console.log('Account Successfully Updated')
            res.redirect(`/admin/account/user/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    },

    updateBalance : async (req, res) => {
            const amount = req.body.amount
        try {
            await accounts.findOneAndUpdate({ _id :  req.params.id}, {
                $inc : {
                    balance : amount
                }
            })
            console.log('balance of user updated')
            res.redirect(`/admin/account/user/${req.params.id}`)
        } catch (error) {
            console.log(error)
        }
    },

    updatestatus : async (req, res) => {
        try {
            await accounts.findByIdAndUpdate(req.params.id, {
                active : req.body.status
            })
            console.log('account have been deactivated')
            res.redirect(`/admin/account/user/${req.params.id}`)
        } catch (error) {
            console.error(error)
        }
    },

    createaccount : async (req, res) => {
        try {
            res.render('admin/index.ejs' , { title : 'Admin Panel'})
        } catch (error) {
            console.error(error)
        }
    },

    getcodes: async (req, res) => {
        try {
            await codes.create({
                cot : cot(),
                imf : imf(),
                tax : tax(),
            })
            console.log('codes created')
            res.redirect('/admin/create')
        } catch (error) {
            console.error(error)
        }
    },

    createcode  : async (req, res) => {
        try {
            const code = await codes.find().lean()
            res.render('admin/create.ejs', { title : 'Create Codes', code : code})
        } catch (error) {
            console.error(error)
        }
    },

    activatebilling : async (req, res) => {
        try {
            await accounts.findByIdAndUpdate(req.params.id, {
                $set : { 
                    billingstatus : true
                }
            })
            res.redirect(`/admin/account/user/${req.params.id}`)
        } catch (error) {
            console.error(error)
        }
    },

    deactivatebilling : async (req, res ) => {
        try {
            await accounts.findByIdAndUpdate(req.params.id, {
                $set : { 
                    billingstatus : false
                }
            })
            res.redirect(`/admin/account/user/${req.params.id}`)
        } catch (error) {
            console.error(error)
        }
    },


    setstatus :  async (req, res) => {
        try {
            await codes.findByIdAndUpdate(req.params.id, {
                $set : {
                    status : true
                }
            })
            console.log('Status Updated')
            res.redirect('/admin/create')
        } catch (error) {
            console.error(error)
        }
    },


    deactivatestatus : async (req, res) => {
        try {
            await codes.findByIdAndUpdate(req.params.id, {
                $set : {
                    status : false
                }
            })
            console.log('Status deactivated')
            res.redirect('/admin/create')
        } catch (error) {
            console.error(error)
        }
    },


    deletecode :  async (req, res) => {
        try {
            await codes.findByIdAndDelete(req.params.id)
            res.redirect('/admin/create')
        } catch (error) {
            console.error(error)
        }
    }

    
 }