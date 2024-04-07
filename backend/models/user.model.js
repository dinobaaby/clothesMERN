'use strict';


const mongoose = require('mongoose')

const Users = mongoose.model('Users',{
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cartData:{
        type: Object
    },
    date:{
        type:Date,
        default: Date.now,
    }
})

module.exports = Users