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
})


module.exports = new mongoose.model('Codes', codes)