
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
            res.render('signup.ejs', { title : "Sign Up"})
        } catch (error) {
            console.error(error)
        }
    },

    postLogin : async (req, res) => {
        try {
            const user = await accounts.find({ accountNumber : req.body.account})
            if(user.length > 0){
                const userObj = user[0]
                res.redirect('user/profile')
            }else{
                res.render('login.ejs', { user : user})
            }
        } catch (error) {
            console.error(error)
        }
    },
}