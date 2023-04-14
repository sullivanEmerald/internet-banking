const mongoose = require('mongoose')

const acountSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true
    },

    middlename : {
        type : String,
        require : true
    },
    
    lastname : {
        type : String,
        require : true
    },

    mobile : {
        type : Number,
        require : true
    },

    dateOfBirth : {
        type : Date,
        require : true
    },

    email : {
        type : String,
        require : true
    },

    accountNumber : {
        type : Number,
        require : true
    },

    balance : {
        type : Number,
        require : true
    },

    gender : {
        type : String,
        require : true
    },

    occupation : {
        type : String,
        require : true
    },

    address : {
        type : String,
        require : true
    },

    nation : {
        type : String,
        require : true
    },

    state : {
        type : String,
        require : true
    },

    landmark : {
        type : String,
        require : true
    },

    kin : {
        type : String,
        require : true
    },

    relationship : {
        type : String,
        require : true
    },

    kinMobile : {
        type : String,
        require : true
    },

    Kinaddress : {
        type : String,
        require : true
    },

    ownerImage : {
        type : String,
        require : true
    },

    cloudinaryId : {
        type : String,
        require : true
    },

    active : {
        type : String,
        required : true
    },

    billingstatus : {
        type : Boolean,
        default : false
    },

    createdAt : {
        type : Date,
        default : Date.now
    },

    

})

const User = new mongoose.model('Account', acountSchema)

module.exports = User