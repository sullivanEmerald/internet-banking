
const accounts =  require('../models/accounts')
const history = require('../models/transact')
const codes  =  require('../models/codes')
const help = require('../models/help');
const validator =  require('validator')

function generateNums(){
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += Math.floor(Math.random() * 10);
    }

    return result
}


function removeCommas(number) {
    const removed =  number.toString().replace(/,/g, '');

    return +removed
}
  


module.exports = {
    getIndex  : async (req, res) => {
        try {
            res.render('index.ejs', { title : 'Home Page', user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    getIvest :  async (req, res) => {
        try {
            res.render('invest.ejs', { title : "Invest In Us", user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    getLoan :  async (req, res) => {
        try {
            res.render('loan.ejs', { title : "Loan", user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    getInsurance : async (req, res) => {
        try {
            res.render('insurance.ejs', { title : "Insurance Policy" , user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    getSave : async (req, res) => {
        try {
            res.render('save.ejs', { title : "Save", user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    getContact : async (req, res) => {
        try {
            res.render('contact.ejs', { title : "Contact Us", user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    getUser : async (req, res) => {
        try {
            res.render('search.ejs', { title : "Find Account", user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    findUser : async (req, res) => {
            const validationErrors = [];
        try {
            const account = await accounts.find({ accountNumber : req.body.account, email : req.user.email})
            const user = account[0]

            if(isNaN(req.body.account)){
                validationErrors.push({ msg: "Account Number can only be numbers" });
            }

            if(!user){
                validationErrors.push({ msg: "Account Number or Email Mismatch" });
            }else{
                if(user.active === 'closed'){
                    validationErrors.push({ msg: "This account have been closed and you no longet have access to this account. Contact the support team, if substantial evidence is provided and the account passess credibility test, it can be reopened. Thank you for banking with us" });
                } 
            }

                
            if(validationErrors.length) {
                req.flash("errors", validationErrors);
                return res.redirect("/search");
            }else{
                res.redirect(`/user/profile/${user._id}`)
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
            const summary = await history.find({ $or: [ { fromNo : userAccount.accountNumber}, {toNumber : userAccount.accountNumber}]})
            res.render('dashboard.ejs',  { title : userAccount.username , user : userAccount, summary : summary})
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
        let validationErrors = [];
        const accountBalance = await accounts.findById(req.params.id)
        console.log(accountBalance)
        const transferAmount =  removeCommas(req.body.amount)
        try {

            if(transferAmount < 1){
                validationErrors.push({ msg: "Please Put An Amount To Transfer" });
            }
           

            if( transferAmount >= accountBalance.balance){
                validationErrors.push({ msg: "Insufficient Balance" });
            }


            if(isNaN(transferAmount)){
                validationErrors.push({ msg: "Wrong Input, Please Enter Digits" });
            }

            if(accountBalance.active === 'dormant'){
                validationErrors = []
                validationErrors.push({ msg: `${accountBalance.username}, Usual activity have been detected on your account and your account have been prohibited to make any local or international transfer. Contact our support to quickly resolve the cause and you can reactivate your account for all transactions. your safety is our priority` });
            }

            if (validationErrors.length) {
                req.flash("errors", validationErrors);
                return res.redirect(`/transfer/${req.params.id}`);
              }else{
                res.render('reciever.ejs', { title : 'Reciever', amount : transferAmount, user : req.params.id})
              }   
        } catch (error) {
            console.error(error)
        }
    },

    postTransfer : async (req, res) => {
        const amount = removeCommas(req.body.amountTransfer)
        let p = Number(amount)
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1; // add 1 because getMonth() returns 0-11 for Jan-Dec
        const year = date.getFullYear();  
        const time = date.toLocaleTimeString();  
        const user = await accounts.findById(req.params.id)
        const validationErrors = [];
        try {

            if(req.body.holder == "" || req.body.account == "" || req.body.name == "" || req.body.description == "" ){
                validationErrors.push({ msg: "Please, All field msut be filled" });
            }

            if(validationErrors.length){
                req.flash("errors", validationErrors);
                return res.render('reciever.ejs', { title : 'Reciever', amount : amount, user : req.params.id});
            }else{
                await history.create({
                    from : `${user.username} ${user.lastname}`,
                    fromNo : user.accountNumber,
                    toName : req.body.holder,
                    toNumber : req.body.account,
                    tobank : req.body.name,
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
                   console.log(userInfo)
                   if(req.user){
                    await history.findByIdAndUpdate(userInfo._id, {
                        $set : {
                            type : true
                        }
                    })
                   }
                   
                res.redirect(`/user/confirm/${userInfo._id}`)
            }
            
           
        //    creating the transaction history
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
            const amount =  req.body.amount
            const check = amount - sendAmount
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

    deleteTransaction : async (req, res) => {
        try {
            const transaction =  await history.findById(req.params.id)
            const amount =  transaction.transferAmount
            await accounts.findOneAndUpdate({ accountNumber : Number(req.params.acc)}, {
                $inc : {
                    balance : amount
                }
            })

            await accounts.findOneAndUpdate({ accountNumber : transaction.toNumber}, {
                $inc : {
                    balance : -amount
                }
            })
            await history.findByIdAndDelete(req.params.id)
            console.log('deleted')

            const user = await accounts.find({ accountNumber : req.params.acc})
            const customer = user[0]
            res.redirect(`/dashboard/${customer.id}`)

        } catch (error) {
            console.error(error)
        }
    },

    confirm : async (req, res) => {
        try {
            const user = await history.findById(req.params.id)
            const accholder = await accounts.find({ accountNumber : user.fromNo})
            const holder = accholder[0]
            res.render('user/confirm', { title : "confirm", user : user, holder : holder})
        } catch (error) {
            console.error(error)
        }
    },

    gotoTransfer : async (req, res) => {
        try {
            const user =  await history.findById(req.params.id)
            const userBio = await accounts.find({ accountNumber : user.fromNo })
            const userBalance = userBio[0]
            res.render('transfer.ejs',  { title :'Transfer' , account : userBalance})
        } catch (error) {
            console.error(error)
        }
    },

    viewTransaction : async (req, res) => {
        const userNumber =  req.params.acc
        try {
            const fullHistory = await history.findById(req.params.id)
            res.render('user/history.ejs', { title : 'History', receipt : fullHistory, user: userNumber})
        } catch (error) {
            console.error(error)
        }
    },

    fetchTransactions  : async (req, res) => {
        const account =  Number(req.params.id)
        try {
            const useracc = await accounts.find({ accountNumber : account})
            const user = useracc[0]
            const summary = await history.find({ $or: [ { fromNo : account}, {toNumber : account}]})
            res.render('user/transactions.ejs',  { title : "Transaction", receipt : summary, user : user})
        } catch (error) {
            console.error(error)
        }
    },

    getPandemicInfo : async (req, res) => {
        try {
            res.render('pandemic.ejs', { title : 'We Care', user : req.user})
        } catch (error) {
            console.error(error)
        }
    },

    internationaltransfer : async (req, res) => {
        try {
            const account = await accounts.findById(req.params.id)
            res.render('international/international.ejs', { title : 'International Transfer', account : account})
        } catch (error) {
            console.error(error)
        }
    }, 

    transferInt : async (req, res) => {
        let validationErrors = [];
        const accountBalance = await accounts.findById(req.params.id)
        console.log(accountBalance)
        const transferAmount =  removeCommas(req.body.amount)
        try {

            if(transferAmount < 1){
                validationErrors.push({ msg: "Please Put An Amount To Transfer" });
            }
           

            if( transferAmount >= accountBalance.balance){
                validationErrors.push({ msg: "Insufficient Balance" });
            }


            if(isNaN(transferAmount)){
                validationErrors.push({ msg: "Wrong Input, Please Enter Digits" });
            }

            if(accountBalance.active === 'dormant'){
                validationErrors = []
                validationErrors.push({ msg: `${accountBalance.username}, Usual activity have been detected on your account and your account have been prohibited to make any local or international transfer. Contact our support to quickly resolve the cause and you can reactivate your account for all transactions. your safety is our priority` });
            }

            if (validationErrors.length) {
                req.flash("errors", validationErrors);
                return res.redirect(`/international/${req.params.id}`);
              }else{
                res.render('international/intreciever.ejs', { title : 'Account Details', amount : transferAmount, user : req.params.id})
              }   
        } catch (error) {
            console.error(error)
        }
    },

    wiretransfer :  async (req, res) => {
        const amount = removeCommas(req.body.amountTransfer)
        let p = Number(amount)
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1; // add 1 because getMonth() returns 0-11 for Jan-Dec
        const year = date.getFullYear();  
        const time = date.toLocaleTimeString();  
        const user = await accounts.findById(req.params.id)
        const validationErrors = [];
        try {

            if(req.body.holder == "" || req.body.account == "" || req.body.name == "" || req.body.description == "" ){
                validationErrors.push({ msg: "Please, All field msut be filled" });
            }

            if(validationErrors.length){
                req.flash("errors", validationErrors);
                return res.render('international/intreciever.ejs', { title : 'Reciever', amount : amount, user : req.params.id});
            }else{
                await history.create({
                    from : `${user.username} ${user.lastname}`,
                    fromNo : user.accountNumber,
                    toName : req.body.holder,
                    toNumber : req.body.account,
                    tobank : req.body.name,
                    description :  req.body.description,
                    referenceNo  : generateNums(),
                    date : `${day}/${month}/${year}`,
                    time : time,
                    transferAmount : p
        
                   })
        
                   if(!user.billingstatus){

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
                    const wirehistory =  await history.find()
                    const transferHistory = wirehistory[wirehistory.length - 1]
                    res.redirect(`/user/confirm/${transferHistory._id}`)
                    
                    } else {
                        const wirehistory =  await history.find()
                        const transferHistory = wirehistory[wirehistory.length - 1]
                        res.render('international/confirm.ejs', { title : 'Enter COT code', history : transferHistory._id})
                    }
            }
        
        } catch (error) {
            console.error(error)
        }

    },

    sendcot : async (req, res) => {
            const wire = await history.findById(req.params.id)
            const cot =  Number(req.body.cot)
            let validationErrors = [];
        try {

            if(cot < 1){
                validationErrors.push({ msg: "You must provide COT code to continue the Transaction" });
            }

            const code =  await codes.find()
            const cotcode = code.find(item => item.cot === cot)
           

            if(!cotcode){
                validationErrors.push({ msg: "This is an invalid code. Contact Customer Service" });
            }else if(cotcode && cotcode.status){
                validationErrors.push({ msg: "The code have been used and expired"});
            }

            if(validationErrors.length){
                req.flash("errors", validationErrors);
                return res.render('international/confirm.ejs',  { title : 'Enter COT code' , history :  req.params.id});
            }else{
                res.render('international/imf.ejs', { title : 'Enter IMF code', transaction : [
                    { cot : cot},
                    {trans : wire._id}
                ]})
            } 

        } catch (error) {  
            console.error(error)
        }
    },

    sendimf : async (req, res) => {
        let validationErrors = [];
        const cotbillingcode =  Number(req.body.cotnum)
        const imfcode = Number(req.body.imf)

        try {

            if(imfcode < 1){
                validationErrors.push({ msg: "You must provide IMF code to continue the Transaction" });
            }

            const code =  await codes.find()
            const cotcode = code.find(item => item.cot === cotbillingcode && item.imf === imfcode)

            if(!cotcode){
                validationErrors.push({ msg: "This is an invalid code. Contact Customer Service" });
            }else if(cotcode && cotcode.status){
                validationErrors.push({ msg: "The code have been used and expired"});
            }

            if(validationErrors.length){
                req.flash("errors", validationErrors);
                return res.render('international/imf.ejs',  { title : 'Enter IMF code' , transaction : [
                    { cot : cotbillingcode},
                    {trans : req.params.id}
                ]});
            }else{
                res.render('international/tax.ejs', { title : 'Enter Tax code', transaction : [
                    { cot : cotbillingcode},
                    {imf : imfcode},
                    {trans : req.params.id}
                ]})
            } 

        } catch (error) {  
            console.error(error)
        }
    },

    sendtax : async (req, res) => {
        let validationErrors = [];
        const cotbillingcode =  Number(req.body.cotnum)
        const imfcode = Number(req.body.imfcode)
        const taxcode = Number(req.body.tax)
        console.log(imfcode)
        console.log(taxcode)
        console.log(cotbillingcode)

        try {

            if(taxcode < 1){
                validationErrors.push({ msg: "You must provide Tax code to continue the Transaction" });
            }

            const code =  await codes.find()
            const cotcode = code.find(item => item.cot === cotbillingcode && item.imf === imfcode && item.tax === taxcode)

            if(!cotcode){
                validationErrors.push({ msg: "This is an invalid code. Contact Customer Service" });
            }else if(cotcode && cotcode.status){
                validationErrors.push({ msg: "The code have been used and expired"});
            }

            if(validationErrors.length){
                req.flash("errors", validationErrors);
                return res.render('international/tax.ejs',  { title : 'Enter TAX code' , transaction : [
                    { cot : cotbillingcode},
                    { imf : imfcode},
                    {trans : req.params.id}
                ]});

            }else{

                await codes.findByIdAndUpdate(cotcode._id, {
                    $set : {
                        assign : true
                    }
                })

                const user = await history.findById(req.params.id)
                let amount = user.transferAmount
                console.log(user)

                await accounts.findOneAndUpdate({ accountNumber : user.fromNo}, {
                    $inc : {
                        balance : -amount
                    }
            })
            
             await accounts.findOneAndUpdate({ accountNumber : user.toNumber}, {
                    $inc : {
                        balance : amount
                    }
                })
            res.redirect(`/user/confirm/${user._id}`)
            } 

        } catch (error) {  
            console.error(error)
        }
    },


    showprofile : async (req, res) => {
        try {
            const profile = await accounts.findById(req.params.id)
            res.render('account.ejs', { title : "Profile" , profile : profile})
        } catch (error) {
            console.error(error)
        }
    },

    gethelp : async (req, res) => {
        try {
            res.render('user/help.ejs', { title : "GET HELP", user: req.user})
        } catch (error) {
            console.error(error)
        }
    },

    sendhelp : async (req, res) => {

        let validationErrors = [];

        if(req.body.name === "" || req.body.account < 1 || req.body.email === '' || req.body.message === ""){
            validationErrors.push({ msg: "No field should be empty" });
        }

        if(!validator.isEmail(req.body.email)){
            validationErrors.push({ msg: "Please put the right email format" });
        }
        
        try {

            if(validationErrors.length){
                req.flash("errors", validationErrors);
                res.redirect('/help')
            }else{
                await help.create({
                    name : req.body.name,
                    account : req.body.account,
                    email : req.body.email,
                    message : req.body.message
                })
                validationErrors = [];
                validationErrors.push({ msg: "You Messaege have been send. Our support team will contact you through the email. Thanks for banking with us" });
                if(validationErrors.length){
                    req.flash("errors", validationErrors);
                    res.redirect('/help')
                }
                
            }
            
        } catch (error) {
            console.error(error)
        }
    }
    

 }










   