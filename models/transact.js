const mongoose = require('mongoose')

const transactHistory = new mongoose.Schema({
  from : {
    type : String,
    required : true,
  },

  fromNo : {
    type : Number,
    required : true,
  },

  toName : {
    type : String,
    required : false,
  },

  toNumber : {
    type : Number,
    required : true,
  },

  tobank : {
    type : String,
    required : true,
  },

  referenceNo: {
    type : Number,
    required  : true,
  },

  date : {
    type : String,
    required : true,
  },

  time : {
    type : String,
    required : true,
  },

  transferAmount : {
    type : Number,
    required : true
  },

  type : {
    type : Boolean,
    default : false,
  },

  status: {
    type : Boolean,
    default : false, 
  },

  description : {
    type : String,
    required : true,
  },

  router : {
    type : String,
    required : false,
  },
  
  switch : {
    type : String,
    required : false,
  },
})


module.exports = new mongoose.model('History', transactHistory )