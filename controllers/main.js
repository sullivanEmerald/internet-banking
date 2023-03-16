
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
        try {
            const transferAmount =  req.body.amount
            Number(transferAmount)
            console.log(typeof transferAmount)
            res.render('reciever.ejs', { title : 'Reciever', amount : transferAmount, user : req.params.id})
        } catch (error) {
            console.error(error)
        }
    },

    postTransfer : async (req, res) => {
        const amount = req.body.amountTransfer.replace(',', '').replace(',', '').replace(',', '').replace(',','').replace(',','')
        let p = Number(amount)
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1; // add 1 because getMonth() returns 0-11 for Jan-Dec
        const year = date.getFullYear();  
        const time = date.toLocaleTimeString();  

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
            transferAmount : p

           })

           await accounts.findByIdAndUpdate(req.params.id, {
                $inc : {
                    balance : -p
                }
           })

           await accounts.findOneAndUpdate({ accountNumber : req.body.account}, {
            $inc : {
                balance : p
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
    
        try {
            const sendAmount = Number(req.body.senderAmount)
            console.log(sendAmount)
            const amount =  req.body.amount
            console.log(amount)
            const check = amount - sendAmount
            console.log(check)
            const oldaccount =  Number(req.body.former)
            const newAccount =  Number(req.body.account)
            const sender =  await history.findById(req.params.id)


            if(oldaccount === newAccount){
                await history.findByIdAndUpdate(req.params.id, {
                    tobank : req.body.name,
                    toName : req.body.holder,
                    transferAmount : amount,
                    description : req.body.description
                })

                if(sendAmount < amount){

                    console.log(check)
                    await accounts.findOneAndUpdate({ accountNumber : oldaccount}, {
                        $inc : {
                            balance : check       
                         }
                    }),


                    await accounts.findOneAndUpdate({ accountNumber : sender.fromNo }, {
                        $inc : {
                            balance : -check          
                         }
                    })
                    
                }else if(sendAmount > amount){
                    await accounts.findOneAndUpdate({ accountNumber : sender.fromNo }, {
                        $inc : {
                            balance : -check          
                         }
                    }),

                    await accounts.findOneAndUpdate({ accountNumber : oldaccount}, {
                        $inc : {
                            balance : check        
                         }
                    })

                }else{
                    await accounts.findOneAndUpdate({ accountNumber : oldaccount}, {
                        $inc : {
                            balance : 0         
                         }
                    })

                    await accounts.findOneAndUpdate({ accountNumber : sender.fromNo }, {
                        $inc : {
                            balance : 0        
                         }
                    })
                }
                

                await history.findByIdAndUpdate(req.params.id, {
                    $set : {
                        status : true    
                     }
                })

                
            }else{
                await history.findByIdAndUpdate(req.params.id, {
                    tobank : req.body.name,
                    toName : req.body.holder,
                    transferAmount : amount,
                    description : req.body.description,
                    toNumber : newAccount
                })

                await accounts.findOneAndUpdate({ accountNumber : oldaccount}, {
                    $inc : {
                        balance : -sendAmount   
                    }
                }),

                await accounts.findOneAndUpdate({ accountNumber : newAccount}, {
                    $inc : {
                        balance : amount
                    }
                }),

                await history.findByIdAndUpdate(req.params.id, {
                    $set : {
                        status : true    
                     }
                })
            } 
            const updatedHistory =  await history.findById(req.params.id)
            res.render('review.ejs', { title : "Review", user : updatedHistory })
           
        } catch (error) {
            console.error(error)
        }
    },

    
}