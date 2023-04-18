const mongoose = require('mongoose')

const saveHelp = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },

    account : {
        type : Number,
        required : true,
    },

    email : {
        type : String,
        required : true,
    },

    message : {
        type : String,
        required : true,
    },

})


module.exports =  new mongoose.model('Help', saveHelp)