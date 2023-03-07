
const accounts =  require('../models/accounts')

module.exports = {
    getIndex  : async (req, res) => {
        try {
            res.render('index.ejs', { title : 'Home Page'})
        } catch (error) {
            console.error(error)
        }
    },

    getIvest :  async (req, res) => {
        try {
            res.render('invest.ejs', { title : "Invest In Us"})
        } catch (error) {
            console.error(error)
        }
    },

    getLoan :  async (req, res) => {
        try {
            res.render('loan.ejs', { title : "Loan"})
        } catch (error) {
            console.error(error)
        }
    },

    getInsurance : async (req, res) => {
        try {
            res.render('insurance.ejs', { title : "Insurance Policy"})
        } catch (error) {
            console.error(error)
        }
    },

    getSave : async (req, res) => {
        try {
            res.render('save.ejs', { title : "Save"})
        } catch (error) {
            console.error(error)
        }
    },

    getContact : async (req, res) => {
        try {
            res.render('contact.ejs', { title : "Contact Us"})
        } catch (error) {
            console.error(error)
        }
    },

    getUser : async (req, res) => {
        try {
            res.render('search.ejs', { title : "Find Account"})
        } catch (error) {
            console.error(error)
        }
    },

    findUser : async (req, res) => {
        try {
            const user = await accounts.find({ accountNumber : req.body.account})
            if(user.length > 0){
                const userObj = user[0]
                res.redirect(`/user/profile/${userObj.id}`)
            }else{
                res.redirect('/search')
            }
        } catch (error) {
            console.error(error)
        }
    },

    getProfie : async (req, res) => {
        try {
            const userAccount = await accounts.findById(req.params.id)
            res.render('profile.ejs', { title : userAccount.username , user : userAccount})
        } catch (error) {
            console.error(error)
        }
    },

    getdashboard  : async (req, res) => {
        try {
            res.render('dashboard.ejs')
        } catch (error) {
            console.error(error)
        }
    },

    getTransfer :  async (req, res) => {
        try {
            const account = await accounts.findById(req.params.id)
            res.render('transfer.ejs', { title : 'Transfer', account : account})
        } catch (error) {
            console.error(error)
        }
    },

    transferMoney :  async (req, res) => {
        console.log(req.body)
        try {
            const transferAmount =  req.body.amount
            console.log(transferAmount)
        } catch (error) {
            console.error(error)
        }
    }
}