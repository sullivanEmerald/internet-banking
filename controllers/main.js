
const accounts =  require('../models/accounts')
const history = require('../models/transact')

function generateNums(){
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return result
}


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
            const userAccount = await accounts.findById(req.params.id)
            res.render('dashboard.ejs',  { title : userAccount.username , user : userAccount})
        } catch (error) {
            console.error(error)
        }
    },

    getTransfer :  async (req, res) => {
        console.log(req.params.id)
        try {
            const account = await accounts.findById(req.params.id)
            res.render('transfer.ejs', { title : 'Transfer', account : account})
        } catch (error) {
            console.error(error)
        }
    },

    transferMoney :  async (req, res) => {
        console.log(req.params.id)
        try {
            const transferAmount =  req.body.amount
            res.render('reciever.ejs', { title : 'Reciever', amount : transferAmount, user : req.params.id})
        } catch (error) {
            console.error(error)
        }
    },

    postTransfer : async (req, res) => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1; // add 1 because getMonth() returns 0-11 for Jan-Dec
        const year = date.getFullYear();  
        const time = date.toLocaleTimeString();  
        const amount = req.body.amountTransfer
        try {
           const user = await accounts.findById(req.params.id)
        //    creating the transaction history
           await history.create({
            from : `${user.username} ${user.lastname}`,
            fromNo : user.accountNumber,
            toName : req.body.holder,
            toNumber : req.body.account,
            tobank : req.body.name,
            account : req.body.account,
            description :  req.body.description,
            referenceNo  : generateNums(),
            date : `${day}/${month}/${year}`,
            time : time,
            transferAmount : amount,

           })

           await accounts.findByIdAndUpdate(req.params.id, {
                $inc : {
                    balance : -amount
                }
           })

           console.log('updated')
           const confirmUser = await history.find()
           const userInfo = confirmUser[confirmUser.length -1]
           res.redirect(`/user/confirm/${userInfo._id}`)
        } catch (error) {
            console.error(error)
        }
    },

    transactionDetails : async (req, res) => {
        try {
            const user =  await history.findById(req.params.id)
            res.render('review.ejs', { title : "Review", user : user})
        } catch (error) {
            console.error(error)
        }
    },

    getHistory : async (req, res) => {
            
        try {
            const userhistory = await history.findById(req.params.id)
            console.log(userhistory)
            res.render('user/editHistory.ejs', { title: 'Edit User', user : userhistory})
        } catch (error) {
            console.error(error)
        }
    },

    correctHistory : async (req, res) => {
        const amount =  req.body.amount
        const oldaccount =  Number(req.body.former)
        const newAccount =  Number(req.body.account)
        console.log(typeof newAccount)
        try {
            if(oldaccount === newAccount){
                await history.findByIdAndUpdate(req.params.id, {
                    tobank : req.body.name,
                    toName : req.body.holder,
                    transferAmount : amount,
                    description : req.body.description
                })
            }else{

                await accounts.find({ accountNumber : oldaccount}, {
                    
                    $inc : {
                        balance : -amount
                    }
                }),

                await accounts.find({ accountNumber : newAccount}, {
                    $inc : {
                        balance : amount
                    }
                })
            }
            console.log('transfer updated')
            const updatedHistory =  await history.findById(req.params.id)
            res.render('review.ejs', { title : "Review", user : updatedHistory })
           
        } catch (error) {
            console.error(error)
        }
    },

    
}