const mongoose =  require('mongoose')

const codes = new mongoose.Schema({
    cot : {
        type : Number, 
        required : true
    },

    imf : {
        type : Number, 
        required : true
    },

    tax : {
        type : Number, 
        required : true
    },

    upp : {
        type : Number, 
        required : true
    },

    assign : {
        type : Boolean, 
        default : false
    },

    status : {
        type : Boolean, 
        default : false
    },


    
})


module.exports = new mongoose.model('Code', codes)